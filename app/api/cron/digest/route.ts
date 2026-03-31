import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { sendWeeklyDigest } from '@/lib/resend'

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
      const { data: messages } = await supabase.from('chat_messages').select('content, is_answered').eq('bot_id', bot.id).eq('role', 'user').gte('created_at', oneWeekAgo)
      if (!messages?.length) continue
      const total = messages.length
      const answered = messages.filter((m: any) => m.is_answered).length
      const answerRate = total > 0 ? Math.round((answered / total) * 100) : 0
      const unanswered = messages.filter((m: any) => !m.is_answered).map((m: any) => m.content).slice(0, 5)
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
