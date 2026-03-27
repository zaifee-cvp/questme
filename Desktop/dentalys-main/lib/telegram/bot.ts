// lib/telegram/bot.ts
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const TELEGRAM_API = 'https://api.telegram.org/bot'

export async function sendTelegramMessage(
  botToken: string,
  chatId: string | number,
  text: string,
  options?: { parse_mode?: string; reply_markup?: unknown }
) {
  const res = await fetch(`${TELEGRAM_API}${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: options?.parse_mode ?? 'Markdown',
      reply_markup: options?.reply_markup,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Telegram sendMessage failed: ${err}`)
  }
}

export async function setTelegramWebhook(
  botToken: string,
  webhookUrl: string,
  secretToken: string
): Promise<{ ok: boolean; description?: string }> {
  const res = await fetch(`${TELEGRAM_API}${botToken}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secretToken,
    }),
  })
  return res.json()
}

export async function deleteTelegramWebhook(botToken: string): Promise<void> {
  await fetch(`${TELEGRAM_API}${botToken}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: '' }),
  })
}

export async function getTelegramBotInfo(
  botToken: string
): Promise<{ ok: boolean; result?: { username: string; first_name: string } }> {
  const res = await fetch(`${TELEGRAM_API}${botToken}/getMe`)
  return res.json()
}

export async function sendTypingIndicator(
  botToken: string,
  chatId: string | number
): Promise<void> {
  try {
    await fetch(`${TELEGRAM_API}${botToken}/sendChatAction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        action: 'typing',
      }),
    })
  } catch {
    // Never throw on typing indicator failure
  }
}

export function formatBookingDateTime(
  isoString: string,
  timezone: string
): { date: string; time: string } {
  const zoned = toZonedTime(new Date(isoString), timezone)
  return {
    date: format(zoned, 'EEEE, d MMMM yyyy'),
    time: format(zoned, 'h:mm a'),
  }
}

export async function transcribeVoiceMessage(
  botToken: string,
  fileId: string
): Promise<string | null> {
  try {
    // 1. Get file path from Telegram
    const fileRes = await fetch(`${TELEGRAM_API}${botToken}/getFile?file_id=${fileId}`)
    if (!fileRes.ok) return null
    const fileData = await fileRes.json() as { ok: boolean; result?: { file_path: string } }
    if (!fileData.ok || !fileData.result?.file_path) return null

    // 2. Download the OGG audio file
    const audioRes = await fetch(
      `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`
    )
    if (!audioRes.ok) return null
    const audioBuffer = await audioRes.arrayBuffer()

    // 3. Transcribe with OpenAI Whisper
    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const file = new File([audioBuffer], 'voice.ogg', { type: 'audio/ogg' })
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
    })

    return transcription.text?.trim() || null
  } catch (err) {
    console.error('[telegram/voice] transcription failed:', err)
    return null
  }
}
