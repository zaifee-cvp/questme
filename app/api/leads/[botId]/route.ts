import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

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

// Pre-chat lead gate: creates the lead the moment a visitor shares their contact
// details, before they ask anything. This is the primary lead creator for every bot.
export async function POST(req: NextRequest, { params }: { params: { botId: string } }) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1'
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  try {
    const supabase = createSupabaseServiceClient()
    const { email, name, phone, trigger_message, sessionId } = await req.json()
    if (!email && !phone) return NextResponse.json({ error: 'Email or phone required' }, { status: 400 })

    // leads.user_id is NOT NULL (FK auth.users) — always stamp the bot owner.
    const { data: bot } = await supabase.from('bots').select('user_id').eq('id', params.botId).eq('is_active', true).single()
    if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })

    // Upsert keyed on session_id (manual, since there's no unique constraint on the
    // column): update the visitor's existing lead on re-submit, otherwise create one.
    const error = await upsertLeadBySession(supabase, sessionId, {
      bot_id: params.botId,
      user_id: bot.user_id,
      session_id: sessionId || null,
      name: name || null,
      email: email || null,
      phone: phone || null,
      trigger_message: trigger_message || null,
    })
    if (error) {
      console.error('[POST /api/leads/[botId]] lead capture failed', error)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    if (sessionId) await supabase.from('chat_sessions').update({ visitor_email: email || null, visitor_name: name || null }).eq('id', sessionId)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[POST /api/leads] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update the live (non-deleted) lead for this session if one exists, otherwise insert.
// Only overwrites fields we were given, so a later "can't answer" trigger_message and
// an earlier gate name/email/phone don't clobber each other. Returns any DB error.
async function upsertLeadBySession(
  supabase: ReturnType<typeof createSupabaseServiceClient>,
  sessionId: string | null | undefined,
  row: { bot_id: string; user_id: string; session_id: string | null; name: string | null; email: string | null; phone: string | null; trigger_message: string | null },
) {
  if (sessionId) {
    const { data: existing } = await supabase.from('leads').select('id').eq('session_id', sessionId).is('deleted_at', null).maybeSingle()
    if (existing) {
      const patch: Record<string, any> = { name: row.name, email: row.email, phone: row.phone }
      if (row.trigger_message !== null) patch.trigger_message = row.trigger_message
      const { error } = await supabase.from('leads').update(patch).eq('id', existing.id)
      return error
    }
  }
  const { error } = await supabase.from('leads').insert(row)
  return error
}
