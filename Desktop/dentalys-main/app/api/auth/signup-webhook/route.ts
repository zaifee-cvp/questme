// app/api/auth/signup-webhook/route.ts
// Called by a Supabase Database Webhook on INSERT to auth.users.
// Sends the welcome email to new business owners.

import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { sendWelcomeEmail } from '@/lib/email/onboarding'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-supabase-webhook-secret')
  const expected = process.env.SUPABASE_WEBHOOK_SECRET
  if (!secret || !expected) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const secretBuf = Buffer.from(secret)
  const expectedBuf = Buffer.from(expected)
  const match =
    secretBuf.length === expectedBuf.length &&
    timingSafeEqual(secretBuf, expectedBuf)
  if (!match) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: { record?: { id?: string; email?: string } }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const userId = body?.record?.id
  const email = body?.record?.email
  if (!userId || !email) {
    return NextResponse.json({ error: 'Missing user data' }, { status: 400 })
  }

  try {
    const db = createAdminClient()

    const { data: profile } = await db
      .from('profiles')
      .select('full_name, business_id')
      .eq('id', userId)
      .maybeSingle()

    const { data: business } = profile?.business_id
      ? await db
          .from('businesses')
          .select('name')
          .eq('id', profile.business_id)
          .maybeSingle()
      : { data: null }

    await sendWelcomeEmail({
      email,
      businessName: business?.name ?? 'Your Business',
      ownerName: profile?.full_name ?? undefined,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[auth/signup-webhook] error:', err)
    return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 })
  }
}
