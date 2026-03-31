import { NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const authClient = createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createSupabaseServiceClient()
  const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single()
  return NextResponse.json(data || { plan: 'free', bot_limit: 1, chat_limit: 100, page_limit: 20 })
}
