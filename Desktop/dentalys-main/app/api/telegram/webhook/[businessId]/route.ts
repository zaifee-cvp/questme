// app/api/telegram/webhook/[businessId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { runAgent } from '@/lib/ai/agent'
import {
  sendTelegramMessage,
  sendTypingIndicator,
  transcribeVoiceMessage,
} from '@/lib/telegram/bot'
import type { TelegramUpdate } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  // 1. Parse body first (needed regardless of secret check)
  let update: TelegramUpdate
  try {
    update = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { businessId } = params

  // 2. Validate secret header against the global env var.
  // If TELEGRAM_WEBHOOK_SECRET is not set, skip validation so the bot
  // still works — the unique businessId URL provides request scoping.
  const incomingSecret = request.headers.get('x-telegram-bot-api-secret-token')
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (expectedSecret && incomingSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 3. Process the update, then return 200.
  // Vercel freezes the container after the response is sent, so we must
  // await here — void/fire-and-forget would be killed before runAgent completes.
  // maxDuration = 60 gives us plenty of headroom.
  try {
    await processWebhook(businessId, update)
  } catch (err) {
    console.error('[telegram/webhook/businessId] error:', err)
  }

  return NextResponse.json({ ok: true })
}

async function processWebhook(businessId: string, update: TelegramUpdate) {
  const message = update.message
  if (!message?.chat) return

  const chatId = String(message.chat.id)
  const db = createAdminClient()

  // Fetch business
  const { data: business } = await db
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single()

  if (!business?.telegram_bot_token) return

  const botToken = business.telegram_bot_token

  // Check subscription — block expired free trials
  const { data: subscription } = await db
    .from('subscriptions')
    .select('status, stripe_subscription_id')
    .eq('business_id', business.id)
    .single()

  const isExpired =
    subscription?.status === 'canceled' && !subscription?.stripe_subscription_id

  if (isExpired) {
    await sendTelegramMessage(
      botToken,
      chatId,
      "I'm sorry, this clinic's AI receptionist is temporarily unavailable. Please contact the clinic directly to book an appointment."
    )
    return
  }

  // Transcribe voice messages to text
  let messageText = message.text
  if (!messageText && message.voice) {
    sendTypingIndicator(botToken, chatId)
    const transcribed = await transcribeVoiceMessage(botToken, message.voice.file_id)
    if (transcribed) {
      messageText = transcribed
      await sendTelegramMessage(botToken, chatId, `🎙️ _"${transcribed}"_`, { parse_mode: 'Markdown' })
    } else {
      await sendTelegramMessage(
        botToken,
        chatId,
        "Sorry, I couldn't understand your voice message. Please try typing your question instead."
      )
      return
    }
  }

  if (!messageText) return

  // Sanitise: strip HTML tags, trim, cap at 1000 chars
  const text = messageText.replace(/<[^>]*>/g, '').trim().slice(0, 1000)

  // Upsert customer on /start
  if (text.startsWith('/start')) {
    const customerName = [message.from?.first_name, message.from?.last_name]
      .filter(Boolean)
      .join(' ')

    const { data: existing } = await db
      .from('customers')
      .select('id')
      .eq('business_id', business.id)
      .eq('telegram_chat_id', chatId)
      .maybeSingle()

    if (!existing) {
      await db.from('customers').insert({
        business_id: business.id,
        telegram_chat_id: chatId,
        name: customerName || null,
        import_source: 'telegram',
      })
    }
  }

  // Run AI agent — /start is passed through so the AI responds with a welcome
  sendTypingIndicator(botToken, chatId)
  try {
    const response = await runAgent({
      db,
      businessId: business.id,
      chatId,
      userMessage: text,
      channel: 'telegram',
    })
    await sendTelegramMessage(botToken, chatId, response)
  } catch (err) {
    console.error('[Agent] error:', err)
    await sendTelegramMessage(
      botToken,
      chatId,
      'Sorry, something went wrong. Please try again or type /start to restart.'
    )
  }
}
