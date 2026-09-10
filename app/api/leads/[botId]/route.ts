import { NextRequest, NextResponse } from 'next/server'
import type { PostgrestError } from '@supabase/supabase-js'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * PostgREST's "column not found in the schema cache" error. It is not a schema
 * problem — it is the cache lagging a migration that added a column, and it
 * clears itself within a second or two. On 8 Sep 2026 it hit POST twice and the
 * route threw both leads away, so it is now retried rather than surfaced.
 */
const SCHEMA_CACHE_STALE = 'PGRST204'
const SCHEMA_CACHE_RETRY_MS = 1500

const LEAD_RECOVERY_INBOX = 'support@cvidsproductions.net'

type LeadRow = {
  bot_id: string
  user_id: string
  session_id: string | null
  name: string | null
  email: string | null
  phone: string | null
  trigger_message: string | null
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

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
  } catch (err: unknown) {
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

    const row: LeadRow = {
      bot_id: params.botId,
      user_id: bot.user_id,
      session_id: sessionId || null,
      name: name || null,
      email: email || null,
      phone: phone || null,
      trigger_message: trigger_message || null,
    }

    // Upsert keyed on session_id (manual, since there's no unique constraint on the
    // column): update the visitor's existing lead on re-submit, otherwise create one.
    let error = await upsertLeadBySession(supabase, sessionId, row)

    // One retry, and only for the stale-cache window. Anything else is a real
    // failure and retrying it would just delay the recovery email.
    if (error?.code === SCHEMA_CACHE_STALE) {
      await delay(SCHEMA_CACHE_RETRY_MS)
      error = await upsertLeadBySession(supabase, sessionId, row)
    }

    if (error) {
      // The row is gone, but the lead is not: it goes out by email so it can be
      // re-entered by hand. Deliberately still a 200 — a visitor who has just
      // handed over their email must never be shown a failure for a database
      // hiccup we have already recovered from out of band.
      await reportLostLead(row, error)
      return NextResponse.json({ success: true })
    }

    if (sessionId) await supabase.from('chat_sessions').update({ visitor_email: email || null, visitor_name: name || null }).eq('id', sessionId)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
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
  row: LeadRow,
): Promise<PostgrestError | null> {
  if (sessionId) {
    const { data: existing } = await supabase.from('leads').select('id').eq('session_id', sessionId).is('deleted_at', null).maybeSingle()
    if (existing) {
      const patch: Partial<LeadRow> = { name: row.name, email: row.email, phone: row.phone }
      if (row.trigger_message !== null) patch.trigger_message = row.trigger_message
      const { error } = await supabase.from('leads').update(patch).eq('id', existing.id)
      return error
    }
  }
  const { error } = await supabase.from('leads').insert(row)
  return error
}

/**
 * Last line of defence for a lead the database refused. Plain text rather than
 * HTML: the body is visitor-supplied and this exists to be copied out by hand.
 *
 * Never throws — if Resend is down too, the payload still reaches the logs.
 */
async function reportLostLead(row: LeadRow, error: PostgrestError) {
  const payload = {
    bot_id: row.bot_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    trigger_message: row.trigger_message,
    session_id: row.session_id,
    pg_code: error.code,
    pg_message: error.message,
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'noreply@questme.ai',
      to: LEAD_RECOVERY_INBOX,
      subject: 'Questme LEAD CAPTURE FAILED — manual recovery needed',
      text: [
        'A lead was submitted but could not be written to the database.',
        'Re-enter it by hand — the visitor was shown a success state.',
        '',
        `bot_id:          ${row.bot_id}`,
        `name:            ${row.name ?? '(none)'}`,
        `email:           ${row.email ?? '(none)'}`,
        `phone:           ${row.phone ?? '(none)'}`,
        `trigger_message: ${row.trigger_message ?? '(none)'}`,
        `session_id:      ${row.session_id ?? '(none)'}`,
        '',
        `Postgres code:    ${error.code}`,
        `Postgres message: ${error.message}`,
      ].join('\n'),
    })
  } catch (emailErr: unknown) {
    console.error('[POST /api/leads/[botId]] recovery email failed to send:', emailErr)
  }

  console.error('[POST /api/leads/[botId]] lead capture failed', payload)
}
