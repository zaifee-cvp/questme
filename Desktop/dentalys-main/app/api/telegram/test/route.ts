// app/api/telegram/test/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTelegramBotInfo } from '@/lib/telegram/bot'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { botToken } = await request.json()

    if (!botToken || typeof botToken !== 'string' || !botToken.trim()) {
      return NextResponse.json({ error: 'Bot token is required' }, { status: 400 })
    }

    const botInfo = await getTelegramBotInfo(botToken.trim())

    if (!botInfo.ok || !botInfo.result) {
      return NextResponse.json(
        { error: 'Invalid bot token. Make sure you copied it correctly from BotFather.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      ok: true,
      username: botInfo.result.username,
      firstName: botInfo.result.first_name,
    })
  } catch {
    return NextResponse.json({ error: 'Could not reach Telegram. Check your internet connection.' }, { status: 500 })
  }
}
