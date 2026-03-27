// app/api/telegram/setup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getTelegramBotInfo,
  setTelegramWebhook,
  deleteTelegramWebhook,
} from '@/lib/telegram/bot'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('business_id')
    .eq('id', user.id)
    .single()

  if (!profile?.business_id) {
    return NextResponse.json({ error: 'No business found' }, { status: 404 })
  }

  try {
    const { botToken } = await request.json()

    if (!botToken || typeof botToken !== 'string') {
      return NextResponse.json(
        { error: 'Bot token is required' },
        { status: 400 }
      )
    }

    // Validate new bot token
    const botInfo = await getTelegramBotInfo(botToken)
    if (!botInfo.ok || !botInfo.result) {
      return NextResponse.json(
        { error: 'Invalid bot token' },
        { status: 400 }
      )
    }

    // If business already has a token, delete old webhook first
    const { data: existing } = await supabase
      .from('businesses')
      .select('telegram_bot_token, telegram_webhook_secret')
      .eq('id', profile.business_id)
      .single()

    if (existing?.telegram_bot_token) {
      try {
        await deleteTelegramWebhook(existing.telegram_bot_token)
      } catch {
        // Old token may be invalid — safe to ignore
      }
    }

    // Use the global TELEGRAM_WEBHOOK_SECRET env var so it matches what
    // the webhook handler validates against. Fall back to a per-business
    // secret only if the env var is not configured.
    const webhookSecret =
      process.env.TELEGRAM_WEBHOOK_SECRET ||
      existing?.telegram_webhook_secret ||
      crypto.randomUUID().replace(/-/g, '')

    // Update business with new token, username, and secret
    await supabase
      .from('businesses')
      .update({
        telegram_bot_token: botToken,
        telegram_bot_username: botInfo.result.username,
        telegram_webhook_secret: webhookSecret,
      })
      .eq('id', profile.business_id)

    // Set new webhook
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/telegram/webhook/${profile.business_id}`
    const webhookResult = await setTelegramWebhook(
      botToken,
      webhookUrl,
      webhookSecret
    )

    if (!webhookResult.ok) {
      return NextResponse.json(
        { error: 'Failed to set webhook: ' + webhookResult.description },
        { status: 500 }
      )
    }

    // Update setup progress
    await supabase
      .from('businesses')
      .update({
        setup_progress: {
          ...(await supabase
            .from('businesses')
            .select('setup_progress')
            .eq('id', profile.business_id)
            .single()
            .then((r) => (r.data?.setup_progress as Record<string, boolean>) || {})),
          telegram: true,
        },
      })
      .eq('id', profile.business_id)

    return NextResponse.json({
      ok: true,
      username: botInfo.result.username,
    })
  } catch (err) {
    console.error('Telegram setup error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
