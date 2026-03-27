// lib/ai/agent.ts
import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import type { AdminClient } from '@/lib/supabase/admin'
import { buildSystemPrompt } from '@/lib/ai/prompts'
import { AI_TOOLS, executeTool } from '@/lib/ai/tools'
import type { ToolContext } from '@/types'

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
}

export async function runAgent({
  db,
  businessId,
  chatId,
  userMessage,
  channel,
}: {
  db: AdminClient
  businessId: string
  chatId: string
  userMessage: string
  channel: 'telegram'
}): Promise<string> {
  // 1. Fetch business
  const { data: business } = await db
    .from('businesses')
    .select('*, subscriptions(plan)')
    .eq('id', businessId)
    .single()

  if (!business) return 'Sorry, this clinic is not configured yet.'

  // 2. Build ToolContext
  const ctx: ToolContext = {
    businessId,
    chatId,
    timezone: business.timezone,
    channel,
  }

  // 3. Upsert conversation thread
  const { data: existingThread } = await db
    .from('conversation_threads')
    .select('id, status')
    .eq('business_id', businessId)
    .eq('telegram_chat_id', chatId)
    .eq('channel', channel)
    .maybeSingle()

  let threadId: string
  let threadStatus: string

  if (existingThread) {
    threadId = existingThread.id
    threadStatus = existingThread.status
    await db
      .from('conversation_threads')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', threadId)
  } else {
    const { data: newThread } = await db
      .from('conversation_threads')
      .insert({
        business_id: businessId,
        telegram_chat_id: chatId,
        channel,
        status: 'active',
      })
      .select('id, status')
      .single()

    if (!newThread) return 'Sorry, something went wrong. Please try again.'
    threadId = newThread.id
    threadStatus = newThread.status
  }

  // 4. If handed off, return handoff message
  if (threadStatus === 'handed_off') {
    return business.handoff_message || 'Our team will be with you shortly.'
  }

  // 5. Insert user message
  await db.from('conversation_logs').insert({
    business_id: businessId,
    thread_id: threadId,
    role: 'user',
    content: userMessage,
  })

  // 6. Fetch last 20 logs from the past 24 hours only.
  // The 24h cutoff prevents stale tool_calls with hallucinated service IDs
  // from poisoning new conversations when a thread spans multiple sessions.
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  // Cast db as any to bypass generated types that don't yet include the new tool_calls column
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // Fetch the 20 MOST RECENT logs (descending), then reverse to chronological order.
  // Using ascending+limit previously fetched the 20 OLDEST, which could truncate
  // mid-tool-call sequences causing OpenAI to reject the messages with a 400 error.
  const { data: rawLogsDesc } = await (db as any)
    .from('conversation_logs')
    .select('role, content, tool_name, tool_call_id, tool_calls')
    .eq('thread_id', threadId)
    .gte('created_at', since24h)
    .order('created_at', { ascending: false })
    .limit(20)
  const rawLogs = rawLogsDesc ? [...rawLogsDesc].reverse() : null
  const logs = rawLogs as Array<{ role: string; content: string | null; tool_name: string | null; tool_call_id: string | null; tool_calls: unknown }> | null

  // 6b. If new session (no prior assistant messages in recent history), load returning customer context
  const isNewSession = !logs || logs.every((l) => l.role !== 'assistant')
  let returningCustomerCtx: string | null = null

  if (isNewSession) {
    const { data: customer } = await db
      .from('customers')
      .select('id, name, phone')
      .eq('business_id', businessId)
      .eq('telegram_chat_id', chatId)
      .maybeSingle()

    if (customer?.name) {
      const { data: lastBooking } = await (db as any)
        .from('bookings')
        .select('start_time, services(name)')
        .eq('business_id', businessId)
        .eq('customer_id', customer.id)
        .order('start_time', { ascending: false })
        .limit(1)
        .maybeSingle()

      const serviceName: string | null = lastBooking?.services?.name ?? null
      const lastDate: string | null = lastBooking?.start_time
        ? new Date(lastBooking.start_time).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : null

      const phonePart = customer.phone ? `, phone ${customer.phone}` : ''
      const visitPart = serviceName && lastDate ? ` Last visit: ${serviceName} on ${lastDate}.` : ''
      returningCustomerCtx = `Returning customer context: Name is ${customer.name}${phonePart}.${visitPart} Greet them by name and acknowledge their previous visit warmly.`
    }
  }

  // 7. Build OpenAI messages
  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: buildSystemPrompt(business, isNewSession) },
  ]

  if (returningCustomerCtx) {
    messages.push({ role: 'system', content: returningCustomerCtx })
  }

  let lastHadToolCalls = false
  for (const log of logs || []) {
    if (log.role === 'user') {
      messages.push({ role: 'user', content: log.content || '' })
      lastHadToolCalls = false
    } else if (log.role === 'assistant') {
      if ((log as any).tool_calls) {
        messages.push({ role: 'assistant', content: log.content || '', tool_calls: (log as any).tool_calls })
        lastHadToolCalls = true
      } else {
        messages.push({ role: 'assistant', content: log.content || '' })
        lastHadToolCalls = false
      }
    } else if (log.role === 'tool' && lastHadToolCalls) {
      messages.push({ role: 'tool', content: log.content || '', tool_call_id: log.tool_call_id || '' })
    }
  }

  // 8. Tool-use loop (max 15 rounds)
  let responseText = 'Sorry, I was unable to process your request. Please try again.'
  const calledOnce = new Set<string>()

  for (let round = 0; round < 15; round++) {
    let completion
    try {
      completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.4,
        max_tokens: 600,
        messages,
        tools: AI_TOOLS,
        tool_choice: 'auto',
      })
    } catch (err) {
      console.error('[Agent] OpenAI API error:', err)
      console.error('[Agent] Messages sent:', JSON.stringify(messages, null, 2))
      throw err
    }

    const choice = completion.choices[0]
    if (!choice) break

    const message = choice.message

    if (message.tool_calls && message.tool_calls.length > 0) {
      // Add assistant message with tool calls
      messages.push({
        role: 'assistant',
        content: message.content || '',
        tool_calls: message.tool_calls,
      })

      // Persist the assistant's tool-call decision so history replays correctly
      await db.from('conversation_logs').insert({
        business_id: businessId,
        thread_id: threadId,
        role: 'assistant',
        content: message.content || '',
        tool_calls: message.tool_calls as unknown as never,
      })

      for (const toolCall of message.tool_calls) {
        // Only block createBooking and createHandoff from running twice
        // Allow all other tools like getAvailableSlots to run multiple times
        if (['createBooking', 'createHandoff'].includes(toolCall.function.name)) {
          if (calledOnce.has(toolCall.function.name)) continue
          calledOnce.add(toolCall.function.name)
        }

        const toolName = toolCall.function.name
        const toolArgs = JSON.parse(toolCall.function.arguments || '{}')

        // Execute tool
        const result = await executeTool(db, ctx, toolName, toolArgs)
        const resultStr = JSON.stringify(result)

        // Save tool call log
        await db.from('conversation_logs').insert({
          business_id: businessId,
          thread_id: threadId,
          role: 'tool',
          content: resultStr,
          tool_name: toolName,
          tool_call_id: toolCall.id,
        })

        // Add tool result to messages
        messages.push({
          role: 'tool',
          content: resultStr,
          tool_call_id: toolCall.id,
        })
      }

      continue
    }

    // Stop: save response and break
    responseText = message.content || responseText

    await db.from('conversation_logs').insert({
      business_id: businessId,
      thread_id: threadId,
      role: 'assistant',
      content: responseText,
    })

    break
  }

  // 9. Update thread updated_at
  await db
    .from('conversation_threads')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', threadId)

  return responseText
}
