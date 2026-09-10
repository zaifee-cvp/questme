import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { searchKnowledge, generateAnswer } from '@/lib/rag'
import { sendHandoffEmail } from '@/lib/resend'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function rateLimit(ip: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1'
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  try {
  const supabase = createSupabaseServiceClient()
  const { botId, sessionId, message, messages = [] } = await req.json()
  if (!botId || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { data: bot } = await supabase.from('bots').select('*').eq('id', botId).eq('is_active', true).is('deleted_at', null).single()
  if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })

  if (bot.handoff_enabled && bot.handoff_trigger_keywords?.length) {
    const lower = message.toLowerCase()
    const triggered = bot.handoff_trigger_keywords.some((kw: string) => lower.includes(kw.toLowerCase()))
    if (triggered) {
      if (bot.handoff_email) {
        await sendHandoffEmail({ to: bot.handoff_email, botName: bot.name, message })
          .catch(err => console.error('[chat] Handoff email failed:', err))
      }
      const answer = "I will connect you with our team right away. Someone will get back to you shortly!"
      if (sessionId) await trackMessages(supabase, sessionId, botId, message, answer, true)
      return NextResponse.json({ answer, isHandoff: true })
    }
  }

  let chunks: Awaited<ReturnType<typeof searchKnowledge>> = []
  try {
    chunks = await searchKnowledge(botId, message)
  } catch (err) {
    console.error('[chat] searchKnowledge error:', err)
  }

  const knowledgeContext = chunks.map((c, i) => `[Source ${i + 1}]: ${c.content}`).join('\n\n')
  const contactParts: string[] = []
  if (bot.contact_phone) contactParts.push(`Phone: ${bot.contact_phone}`)
  if (bot.contact_whatsapp) contactParts.push(`WhatsApp: ${bot.contact_whatsapp}`)
  if (bot.contact_email) contactParts.push(`Email: ${bot.contact_email}`)
  if (bot.contact_website) contactParts.push(`Website: ${bot.contact_website}`)
  if (bot.contact_address) contactParts.push(`Address: ${bot.contact_address}`)
  if (bot.contact_instagram) contactParts.push(`Instagram: ${bot.contact_instagram}`)
  if (bot.contact_facebook) contactParts.push(`Facebook: ${bot.contact_facebook}`)
  const contactContext = contactParts.length ? `\n\n[Contact Information]:\n${contactParts.join('\n')}` : ''
  const context = knowledgeContext + contactContext

  let answer: string
  try {
    answer = await generateAnswer({
      botName: bot.name,
      fallbackMessage: bot.fallback_message,
      restrictToKnowledge: bot.restrict_to_knowledge,
      context,
      messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
    })
  } catch (err) {
    console.error('[chat] generateAnswer error:', err)
    // Bot fell back due to an error — surface capture too when a fallback exists.
    return NextResponse.json({ answer: bot.fallback_message || 'Sorry, I had trouble responding. Please try again.', cannot_answer: !!bot.fallback_message })
  }

  // Explicit "can't answer" signal for the client's inline lead form. The bot's
  // fallback_message is customizable per bot, so we must NEVER phrase-match it. The
  // fallback path fires when the bot is knowledge-restricted and either found no
  // relevant knowledge or the model returned the configured fallback verbatim.
  const fallbackText = (bot.fallback_message || '').trim()
  const cannotAnswer = !!bot.restrict_to_knowledge &&
    (chunks.length === 0 || (fallbackText.length > 0 && answer.trim() === fallbackText))
  const isAnswered = !cannotAnswer
  if (sessionId) await trackMessages(supabase, sessionId, botId, message, answer, isAnswered)
  return NextResponse.json({ answer, isAnswered, cannot_answer: cannotAnswer })
  } catch (err: any) {
    console.error('[POST /api/chat] unhandled error:', err)
    return NextResponse.json({ answer: 'Sorry, something went wrong. Please try again.' }, { status: 500 })
  }
}

/**
 * Awaited by both call sites, and it must stay that way. Vercel freezes the
 * instance the moment the response is sent, so anything still in flight here is
 * abandoned: the two inserts run first and mostly landed, the RPC runs last and
 * never once did — every bot's chat_count sat at 0 across 116 messages while the
 * plans meter on that number.
 *
 * Never throws. Now that it is awaited, an uncaught error here would reach the
 * visitor as a failed chat; a tracking problem is ours, not theirs.
 */
async function trackMessages(
  supabase: ReturnType<typeof createSupabaseServiceClient>,
  sessionId: string,
  botId: string,
  userMsg: string,
  botMsg: string,
  isAnswered: boolean,
) {
  try {
    const { error: insertError } = await supabase.from('chat_messages').insert([
      { session_id: sessionId, bot_id: botId, role: 'user', content: userMsg, is_answered: true },
      { session_id: sessionId, bot_id: botId, role: 'assistant', content: botMsg, is_answered: isAnswered },
    ])
    if (insertError) {
      console.error('[chat] chat_messages insert failed', { sessionId, botId, error: insertError })
    }

    // supabase-js resolves with { error } instead of rejecting, so the
    // .catch(console.error) that used to sit here could never fire for a
    // database failure — it read as error handling that wasn't there.
    const { error: rpcError } = await supabase.rpc('increment_bot_chat_count', { p_bot_id: botId })
    if (rpcError) {
      console.error('[chat] increment_bot_chat_count failed', { sessionId, botId, error: rpcError })
    }
  } catch (err: unknown) {
    console.error('[chat] trackMessages failed', { sessionId, botId, err })
  }
}
