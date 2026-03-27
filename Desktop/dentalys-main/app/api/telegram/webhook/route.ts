// app/api/telegram/webhook/route.ts
// Flat webhook for the global system Telegram bot (not per-business bots).
// Per-business webhooks are handled by app/api/telegram/webhook/[businessId]/route.ts.

import { NextRequest, NextResponse } from 'next/server'
import { handleBotCommand } from '@/lib/telegram/bot-commands'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-telegram-bot-api-secret-token')
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let update: unknown
  try {
    update = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Process asynchronously — Telegram requires a fast 200 response
  void handleBotCommand(update as Parameters<typeof handleBotCommand>[0]).catch((err) =>
    console.error('[telegram/webhook] handleBotCommand error:', err)
  )

  return NextResponse.json({ ok: true })
}
