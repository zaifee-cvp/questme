import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
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
