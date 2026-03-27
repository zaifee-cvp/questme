// app/api/telegram/disconnect/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
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

  const { data: business } = await supabase
    .from('businesses')
    .select('telegram_bot_token')
    .eq('id', profile.business_id)
    .single()

  if (business?.telegram_bot_token) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${business.telegram_bot_token}/deleteWebhook`
      )
      const result = await res.json()
      if (!result.ok) {
        console.error('Failed to delete Telegram webhook:', result.description)
      }
    } catch (err) {
      console.error('Error calling Telegram deleteWebhook:', err)
    }
  }

  const { error } = await supabase
    .from('businesses')
    .update({
      telegram_bot_token: null,
      telegram_bot_username: null,
    })
    .eq('id', profile.business_id)

  if (error) {
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
