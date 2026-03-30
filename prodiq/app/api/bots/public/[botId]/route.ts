import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: { botId: string } }) {
  const supabase = createSupabaseServiceClient()
  const { data, error } = await supabase.from('bots').select('id, name, welcome_message, lead_capture_enabled, lead_capture_prompt, color').eq('id', params.botId).eq('is_active', true).is('deleted_at', null).single()
  if (error || !data) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
  return NextResponse.json(data)
}
