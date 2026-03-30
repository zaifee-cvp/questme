import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: { botId: string } }) {
  const authClient = createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createSupabaseServiceClient()
  const { data: bot } = await supabase.from('bots').select('id').eq('id', params.botId).eq('user_id', user.id).single()
  if (!bot) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const { data: messages } = await supabase.from('chat_messages').select('content, is_answered, role').eq('bot_id', params.botId)
  const userMessages = (messages || []).filter((m: any) => m.role === 'user')
  const answered = userMessages.filter((m: any) => m.is_answered).length
  const answerRate = userMessages.length > 0 ? Math.round((answered / userMessages.length) * 100) : 0
  const unansweredQuestions = userMessages.filter((m: any) => !m.is_answered).map((m: any) => m.content).slice(0, 10)
  const { count: totalLeads } = await supabase.from('leads').select('id', { count: 'exact', head: true }).eq('bot_id', params.botId)
  return NextResponse.json({ totalChats: userMessages.length, answerRate, unansweredCount: userMessages.filter((m: any) => !m.is_answered).length, totalLeads: totalLeads || 0, unansweredQuestions })
}
