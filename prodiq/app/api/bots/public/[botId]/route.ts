import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: { botId: string } }) {
  const supabase = createSupabaseServiceClient()
  const { data: bot, error } = await supabase
    .from('bots')
    .select('id, name, welcome_message, lead_capture_enabled, lead_capture_prompt, color, contact_phone, contact_whatsapp, contact_email, contact_address, contact_website, contact_instagram, contact_facebook, user_id')
    .eq('id', params.botId)
    .eq('is_active', true)
    .is('deleted_at', null)
    .single()

  if (error || !bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })

  // Check if owner has white label (Scale plan)
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('white_label, plan')
    .eq('user_id', bot.user_id)
    .single()

  const white_label = sub?.plan === 'scale' || sub?.white_label === true

  return NextResponse.json({ id: bot.id, name: bot.name, welcome_message: bot.welcome_message, lead_capture_enabled: bot.lead_capture_enabled, lead_capture_prompt: bot.lead_capture_prompt, color: bot.color, contact_phone: bot.contact_phone, contact_whatsapp: bot.contact_whatsapp, contact_email: bot.contact_email, contact_address: bot.contact_address, contact_website: bot.contact_website, contact_instagram: bot.contact_instagram, contact_facebook: bot.contact_facebook, white_label })
}
