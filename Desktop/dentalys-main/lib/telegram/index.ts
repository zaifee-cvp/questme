// lib/telegram/index.ts
// Global (system-level) Telegram bot utilities.
// For per-business bot operations, use lib/telegram/bot.ts directly.

export {
  sendTelegramMessage,
  setTelegramWebhook,
  deleteTelegramWebhook,
  getTelegramBotInfo,
  sendTypingIndicator,
} from './bot'

const TELEGRAM_API = 'https://api.telegram.org/bot'

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set')
  return token
}

/**
 * Send a message using the global system bot token.
 */
export async function sendGlobalTelegramMessage(
  chatId: string | number,
  text: string,
  parseMode: 'Markdown' | 'HTML' | 'MarkdownV2' = 'Markdown'
): Promise<void> {
  const token = getBotToken()
  const res = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Telegram sendMessage failed: ${err}`)
  }
}

/**
 * Register the global system bot webhook URL with Telegram.
 */
export async function registerWebhook(
  webhookUrl: string,
  secret: string
): Promise<{ ok: boolean; description?: string }> {
  const token = getBotToken()
  const res = await fetch(`${TELEGRAM_API}${token}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: webhookUrl, secret_token: secret }),
  })
  return res.json()
}

/**
 * Get webhook info for the global system bot.
 */
export async function getWebhookInfo(): Promise<{
  ok: boolean
  result?: { url: string; has_custom_certificate: boolean; pending_update_count: number }
}> {
  const token = getBotToken()
  const res = await fetch(`${TELEGRAM_API}${token}/getWebhookInfo`)
  return res.json()
}

/**
 * Send a booking-change alert to a business owner via their business bot.
 */
export async function sendBookingAlert(
  botToken: string,
  chatId: string | number,
  alert: {
    type: 'new' | 'cancelled' | 'rescheduled'
    customerName: string
    service: string
    dateTime: string
  }
): Promise<void> {
  const icons = { new: '📅', cancelled: '❌', rescheduled: '🔄' }
  const labels = { new: 'New Booking', cancelled: 'Booking Cancelled', rescheduled: 'Booking Rescheduled' }
  const text =
    `${icons[alert.type]} *${labels[alert.type]}*\n\n` +
    `👤 ${alert.customerName}\n` +
    `📋 ${alert.service}\n` +
    `🕐 ${alert.dateTime}`
  const { sendTelegramMessage: send } = await import('./bot')
  await send(botToken, chatId, text)
}
