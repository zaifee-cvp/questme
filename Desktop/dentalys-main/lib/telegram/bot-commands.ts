// lib/telegram/bot-commands.ts
// Handles commands for the global system Telegram bot (not per-business bots).

import { createAdminClient } from '@/lib/supabase/admin'
import { sendGlobalTelegramMessage } from './index'

export interface TelegramUpdate {
  message?: {
    chat: { id: number }
    from?: { id: number; first_name?: string; username?: string }
    text?: string
  }
}

export async function handleBotCommand(update: TelegramUpdate): Promise<void> {
  const message = update.message
  if (!message?.text) return

  const chatId = message.chat.id
  const text = message.text.trim()
  const command = text.split(' ')[0].toLowerCase()

  switch (command) {
    case '/start':
      await handleStart(chatId, message.from?.first_name)
      break
    case '/status':
      await handleStatus(chatId)
      break
    case '/help':
      await handleHelp(chatId)
      break
    default:
      // Silently ignore unrecognized commands
      break
  }
}

async function handleStart(chatId: number, firstName?: string) {
  const name = firstName ?? 'there'
  await sendGlobalTelegramMessage(
    chatId,
    `👋 Hi ${name}! Welcome to *Dentalys*.\n\nI'm the system bot. Use /help to see available commands.`
  )
}

async function handleStatus(chatId: number) {
  const db = createAdminClient()
  const { count: businessCount } = await db
    .from('businesses')
    .select('*', { count: 'exact', head: true })
  const { count: bookingCount } = await db
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'confirmed')

  await sendGlobalTelegramMessage(
    chatId,
    `✅ *Dentalys is online*\n\n` +
      `📊 Businesses: ${businessCount ?? 0}\n` +
      `📅 Confirmed bookings: ${bookingCount ?? 0}`
  )
}

async function handleHelp(chatId: number) {
  await sendGlobalTelegramMessage(
    chatId,
    `*Dentalys System Bot*\n\n` +
      `/start — Welcome message\n` +
      `/status — System status & stats\n` +
      `/help — Show this help`
  )
}
