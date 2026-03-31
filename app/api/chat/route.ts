import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { searchKnowledge, generateAnswer } from '@/lib/rag'
import { sendHandoffEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
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
        sendHandoffEmail({ to: bot.handoff_email, botName: bot.name, message })
          .catch(err => console.error('[chat] Handoff email failed:', err))
      }
      const answer = "I will connect you with our team right away. Someone will get back to you shortly!"
      if (sessionId) trackMessages(supabase, sessionId, botId, message, answer, true)
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
    return NextResponse.json({ answer: bot.fallback_message || 'Sorry, I had trouble responding. Please try again.' })
  }

  const isAnswered = chunks.length > 0 || !bot.restrict_to_knowledge
  if (sessionId) trackMessages(supabase, sessionId, botId, message, answer, isAnswered)
  return NextResponse.json({ answer, isAnswered })
  } catch (err: any) {
    console.error('[POST /api/chat] unhandled error:', err)
    return NextResponse.json({ answer: 'Sorry, something went wrong. Please try again.' }, { status: 500 })
  }
}

async function trackMessages(supabase: any, sessionId: string, botId: string, userMsg: string, botMsg: string, isAnswered: boolean) {
  await supabase.from('chat_messages').insert([
    { session_id: sessionId, bot_id: botId, role: 'user', content: userMsg, is_answered: true },
    { session_id: sessionId, bot_id: botId, role: 'assistant', content: botMsg, is_answered: isAnswered },
  ])
  await supabase.rpc('increment_bot_chat_count', { p_bot_id: botId }).catch(console.error)
}
