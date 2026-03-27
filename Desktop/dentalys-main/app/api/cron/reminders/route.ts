// app/api/cron/reminders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendTelegramMessage } from '@/lib/telegram/bot'
import { format, addHours, addMinutes } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createAdminClient()
  const now = new Date()

  const reminder24hStart = addMinutes(addHours(now, 23), 45)
  const reminder24hEnd = addMinutes(addHours(now, 24), 15)
  const reminder1hStart = addMinutes(now, 45)
  const reminder1hEnd = addMinutes(addHours(now, 1), 15)

  try {
    const { data: bookings24h } = await db
      .from('bookings')
      .select('id, customer_id, service_name, start_time, business_id')
      .eq('status', 'confirmed')
      .eq('reminder_24h_sent', false)
      .gte('start_time', reminder24hStart.toISOString())
      .lte('start_time', reminder24hEnd.toISOString())

    const { data: bookings1h } = await db
      .from('bookings')
      .select('id, customer_id, service_name, start_time, business_id')
      .eq('status', 'confirmed')
      .eq('reminder_1h_sent', false)
      .gte('start_time', reminder1hStart.toISOString())
      .lte('start_time', reminder1hEnd.toISOString())

    let sentCount = 0

    async function sendReminder(
      booking: { id: string; customer_id: string | null; service_name: string | null; start_time: string; business_id: string },
      messageText: string,
      reminderField: 'reminder_24h_sent' | 'reminder_1h_sent'
    ) {
      if (!booking.customer_id) return

      const { data: customer } = await db
        .from('customers')
        .select('telegram_chat_id, name')
        .eq('id', booking.customer_id)
        .maybeSingle()

      if (!customer?.telegram_chat_id) return

      const { data: business } = await db
        .from('businesses')
        .select('telegram_bot_token, name, timezone')
        .eq('id', booking.business_id)
        .maybeSingle()

      if (!business?.telegram_bot_token) return

      const tz = business.timezone || 'UTC'
      const localTime = toZonedTime(new Date(booking.start_time), tz)
      const timeStr = reminderField === 'reminder_24h_sent'
        ? format(localTime, "EEEE, MMMM d 'at' h:mm a")
        : format(localTime, 'h:mm a')

      const message = messageText
        .replace('{name}', customer.name || 'there')
        .replace('{service}', booking.service_name || 'your appointment')
        .replace('{clinic}', business.name)
        .replace('{time}', timeStr)

      try {
        await sendTelegramMessage(business.telegram_bot_token, customer.telegram_chat_id, message)
        await db.from('bookings').update({ [reminderField]: true }).eq('id', booking.id)
        sentCount++
      } catch (err) {
        console.error(`[cron/reminders] failed to send reminder for booking ${booking.id}:`, err)
      }
    }

    const msg24h =
      `📅 Appointment Reminder\n\n` +
      `Hi {name}! Just a reminder about your appointment tomorrow:\n\n` +
      `📋 Service: {service}\n` +
      `🏥 Clinic: {clinic}\n` +
      `🕐 Time: {time}\n\n` +
      `We look forward to seeing you! If you need to reschedule, please contact us.`

    const msg1h =
      `⏰ Your appointment is in 1 hour!\n\n` +
      `Hi {name}!\n\n` +
      `📋 Service: {service}\n` +
      `🏥 Clinic: {clinic}\n` +
      `🕐 Time: {time}\n\n` +
      `See you soon! 😊`

    for (const booking of bookings24h ?? []) {
      await sendReminder(booking, msg24h, 'reminder_24h_sent')
    }
    for (const booking of bookings1h ?? []) {
      await sendReminder(booking, msg1h, 'reminder_1h_sent')
    }

    return NextResponse.json({
      success: true,
      reminders_24h: bookings24h?.length ?? 0,
      reminders_1h: bookings1h?.length ?? 0,
      sent: sentCount,
    })
  } catch (err) {
    console.error('[cron/reminders] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
