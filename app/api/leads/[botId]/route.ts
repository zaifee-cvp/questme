import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

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

export async function GET(_req: NextRequest, { params }: { params: { botId: string } }) {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = createSupabaseServiceClient()
    const { data: bot } = await supabase.from('bots').select('id').eq('id', params.botId).eq('user_id', user.id).single()
    if (!bot) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const { data } = await supabase.from('leads').select('*').eq('bot_id', params.botId).is('deleted_at', null).order('created_at', { ascending: false })
    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error('[GET /api/leads] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { botId: string } }) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1'
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  try {
    const supabase = createSupabaseServiceClient()
    const { email, name, sessionId } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
    const { data: bot } = await supabase.from('bots').select('user_id').eq('id', params.botId).eq('is_active', true).single()
    if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    await supabase.from('leads').insert({ bot_id: params.botId, user_id: bot.user_id, email, name: name || null, session_id: sessionId || null })
    if (sessionId) await supabase.from('chat_sessions').update({ visitor_email: email, visitor_name: name || null }).eq('id', sessionId)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[POST /api/leads] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
