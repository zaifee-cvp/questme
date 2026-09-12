import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { failedQuestions } from '@/lib/unanswered'

export async function GET(_req: NextRequest, { params }: { params: { botId: string } }) {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = createSupabaseServiceClient()
    const { data: bot } = await supabase.from('bots').select('id').eq('id', params.botId).eq('user_id', user.id).single()
    if (!bot) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    // The answer flag lives on the ASSISTANT row — a user row is a question and
    // has nothing to be answered. Counting user rows made the rate a constant.
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('content, is_answered, role, session_id, created_at')
      .eq('bot_id', params.botId)
      .order('created_at', { ascending: true })

    const rows = messages || []
    const replies = rows.filter((m: any) => m.role === 'assistant')
    const answered = replies.filter((m: any) => m.is_answered).length
    const answerRate = replies.length > 0 ? Math.round((answered / replies.length) * 100) : 0
    const unansweredQuestions = failedQuestions(rows)

    const { count: totalLeads } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('bot_id', params.botId)

    return NextResponse.json({
      totalChats: rows.filter((m: any) => m.role === 'user').length,
      answerRate,
      unansweredCount: replies.length - answered,
      totalLeads: totalLeads || 0,
      unansweredQuestions: unansweredQuestions.slice(-10).reverse(),
    })
  } catch (err: any) {
    console.error('[GET /api/analytics] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
