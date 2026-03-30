import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { searchKnowledge, generateAnswer } from '@/lib/rag'
import { sendHandoffEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServiceClient()
  const { botId, sessionId, message, messages = [] } = await req.json()
  if (!botId || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { data: bot } = await supabase.from('bots').select('*').eq('id', botId).eq('is_active', true).is('deleted_at', null).single()
  if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })

  if (bot.handoff_enabled && bot.handoff_trigger_keywords?.length) {
    const lower = message.toLowerCase()
    const triggered = bot.handoff_trigger_keywords.some((kw: string) => lower.includes(kw.toLowerCase()))
    if (triggered) {
      if (bot.handoff_email) sendHandoffEmail({ to: bot.handoff_email, botName: bot.name, message }).catch(console.error)
      const answer = "I will connect you with our team right away. Someone will get back to you shortly!"
      if (sessionId) trackMessages(supabase, sessionId, botId, message, answer, true)
      return NextResponse.json({ answer, isHandoff: true })
    }
  }

  const chunks = await searchKnowledge(botId, message)
  const context = chunks.map((c, i) => `[Source ${i + 1}]: ${c.content}`).join('\n\n')
  const answer = await generateAnswer({
    botName: bot.name,
    fallbackMessage: bot.fallback_message,
    restrictToKnowledge: bot.restrict_to_knowledge,
    context,
    messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
  })

  const isAnswered = chunks.length > 0 || !bot.restrict_to_knowledge
  if (sessionId) trackMessages(supabase, sessionId, botId, message, answer, isAnswered)
  return NextResponse.json({ answer, isAnswered })
}

async function trackMessages(supabase: any, sessionId: string, botId: string, userMsg: string, botMsg: string, isAnswered: boolean) {
  await supabase.from('chat_messages').insert([
    { session_id: sessionId, bot_id: botId, role: 'user', content: userMsg, is_answered: true },
    { session_id: sessionId, bot_id: botId, role: 'assistant', content: botMsg, is_answered: isAnswered },
  ])
  await supabase.rpc('increment_bot_chat_count', { p_bot_id: botId }).catch(console.error)
}
