// app/api/conversations/send/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendTelegramMessage } from '@/lib/telegram/bot'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!checkRateLimit(`send:${user.id}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { threadId, message } = await request.json()
  if (!threadId || !message) {
    return NextResponse.json(
      { error: 'threadId and message are required' },
      { status: 400 }
    )
  }

  // Validate threadId is a UUID (prevents injection via .eq filter)
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(threadId)) {
    return NextResponse.json({ error: 'Invalid threadId' }, { status: 400 })
  }

  // Telegram max message length is 4096 characters
  if (typeof message !== 'string' || message.length > 4096) {
    return NextResponse.json(
      { error: 'Message too long (max 4096 characters)' },
      { status: 400 }
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('business_id')
    .eq('id', user.id)
    .single<{ business_id: string | null }>()
  if (!profile?.business_id) {
    return NextResponse.json({ error: 'No business found' }, { status: 400 })
  }

  // Verify thread belongs to this business
  const { data: thread } = await supabase
    .from('conversation_threads')
    .select('id, business_id, channel, telegram_chat_id, customer_id')
    .eq('id', threadId)
    .eq('business_id', profile.business_id)
    .single()

  if (!thread) {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
  }

  // Fetch business for channel credentials
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', profile.business_id)
    .single()

  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 })
  }

  // Send via Telegram
  if (!business.telegram_bot_token || !thread.telegram_chat_id) {
    return NextResponse.json(
      { error: 'Telegram not configured for this thread' },
      { status: 400 }
    )
  }
  await sendTelegramMessage(business.telegram_bot_token, thread.telegram_chat_id, message)

  // Log the operator reply
  await supabase.from('conversation_logs').insert({
    business_id: profile.business_id,
    thread_id: threadId,
    role: 'assistant' as const,
    content: message,
  })

  return NextResponse.json({ success: true })
}
