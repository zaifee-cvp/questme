import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'

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
    const { botId, visitorId } = await req.json()
    if (!botId) return NextResponse.json({ error: 'Missing botId' }, { status: 400 })
    const { data } = await supabase.from('chat_sessions').insert({ bot_id: botId, visitor_id: visitorId || crypto.randomUUID() }).select().single()
    return NextResponse.json({ sessionId: data?.id })
  } catch (err: any) {
    console.error('[POST /api/sessions] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
