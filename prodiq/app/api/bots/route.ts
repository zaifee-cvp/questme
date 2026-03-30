import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const authClient = createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createSupabaseServiceClient()
  const { data } = await supabase.from('bots').select('*').eq('user_id', user.id).is('deleted_at', null).order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const authClient = createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createSupabaseServiceClient()
  const { data: sub } = await supabase.from('subscriptions').select('bot_limit').eq('user_id', user.id).single()
  const { count } = await supabase.from('bots').select('id', { count: 'exact', head: true }).eq('user_id', user.id).is('deleted_at', null)
  if ((count || 0) >= (sub?.bot_limit || 1)) return NextResponse.json({ error: 'Bot limit reached. Upgrade your plan to create more bots.' }, { status: 403 })
  const body = await req.json()
  const { data, error } = await supabase.from('bots').insert({ user_id: user.id, name: body.name, description: body.description || '', welcome_message: body.welcome_message || 'Hi! How can I help you today?', color: body.color || '#AAFF00' }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
