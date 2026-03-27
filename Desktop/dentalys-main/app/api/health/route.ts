// app/api/health/route.ts
// Checks all external service dependencies. Returns 200 ok or 503 degraded.

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe'

export const runtime = 'nodejs'

async function checkSupabase(): Promise<{ ok: boolean; latencyMs: number }> {
  const start = Date.now()
  try {
    const db = createAdminClient()
    const { error } = await db.from('businesses').select('id').limit(1)
    return { ok: !error, latencyMs: Date.now() - start }
  } catch {
    return { ok: false, latencyMs: Date.now() - start }
  }
}

async function checkTelegram(): Promise<{ ok: boolean }> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return { ok: false }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
      signal: AbortSignal.timeout(5000),
    })
    const data = await res.json() as { ok: boolean }
    return { ok: !!data.ok }
  } catch {
    return { ok: false }
  }
}

async function checkStripe(): Promise<{ ok: boolean }> {
  try {
    await stripe.balance.retrieve()
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

async function checkEmail(): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { ok: false }
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(5000),
    })
    return { ok: res.ok }
  } catch {
    return { ok: false }
  }
}

export async function GET() {
  const [supabaseResult, telegramResult, stripeResult, emailResult] =
    await Promise.allSettled([checkSupabase(), checkTelegram(), checkStripe(), checkEmail()])

  const checks = {
    supabase:
      supabaseResult.status === 'fulfilled' ? supabaseResult.value : { ok: false },
    telegram:
      telegramResult.status === 'fulfilled' ? telegramResult.value : { ok: false },
    stripe:
      stripeResult.status === 'fulfilled' ? stripeResult.value : { ok: false },
    email:
      emailResult.status === 'fulfilled' ? emailResult.value : { ok: false },
  }

  // Core services must be healthy; external integrations are optional
  const coreOk = checks.supabase.ok
  const httpStatus = coreOk ? 200 : 503

  return NextResponse.json(
    {
      status: coreOk ? 'ok' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: httpStatus }
  )
}
