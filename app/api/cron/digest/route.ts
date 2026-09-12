import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { sendWeeklyDigest } from '@/lib/resend'
import { failedQuestions } from '@/lib/unanswered'

export async function GET(req: NextRequest) {
  try {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createSupabaseServiceClient()
  const { data: users } = await supabase.auth.admin.listUsers()
  if (!users?.users) return NextResponse.json({ sent: 0 })
  let sent = 0
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  for (const user of users.users) {
    if (!user.email) continue
    const { data: bots } = await supabase.from('bots').select('id, name').eq('user_id', user.id).eq('is_active', true).is('deleted_at', null)
    if (!bots?.length) continue
    for (const bot of bots) {
      // Same rule as the dashboard: the answer flag lives on the assistant row.
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('content, is_answered, role, session_id, created_at')
        .eq('bot_id', bot.id)
        .gte('created_at', oneWeekAgo)
        .order('created_at', { ascending: true })
      const rows = messages || []
      const replies = rows.filter((m: any) => m.role === 'assistant')
      if (!replies.length) continue
      const total = rows.filter((m: any) => m.role === 'user').length
      const answered = replies.filter((m: any) => m.is_answered).length
      const answerRate = replies.length > 0 ? Math.round((answered / replies.length) * 100) : 0
      const unanswered = failedQuestions(rows).slice(-5).reverse()
      const { count: leadCount } = await supabase.from('leads').select('id', { count: 'exact', head: true }).eq('bot_id', bot.id).gte('created_at', oneWeekAgo)
      await sendWeeklyDigest({ to: user.email, botName: bot.name, totalChats: total, answerRate, topUnanswered: unanswered, leadsThisWeek: leadCount || 0 }).catch(console.error)
      sent++
    }
  }
  return NextResponse.json({ sent })
  } catch (err: any) {
    console.error('[GET /api/cron/digest] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
