import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const authClient = createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const botId = req.nextUrl.searchParams.get('botId')
  if (!botId) return NextResponse.json({ error: 'Missing botId' }, { status: 400 })
  const supabase = createSupabaseServiceClient()
  const { data: folders } = await supabase
    .from('knowledge_folders')
    .select('*')
    .eq('bot_id', botId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
  return NextResponse.json(folders ?? [])
}

export async function POST(req: NextRequest) {
  const authClient = createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, botId } = await req.json()
  if (!name || !botId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const supabase = createSupabaseServiceClient()
  const { data: folder, error } = await supabase
    .from('knowledge_folders')
    .insert({ name, bot_id: botId, user_id: user.id })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(folder)
}
