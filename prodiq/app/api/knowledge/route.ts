import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const authClient = createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const botId = req.nextUrl.searchParams.get('botId')
  if (!botId) return NextResponse.json({ error: 'Missing botId' }, { status: 400 })
  const supabase = createSupabaseServiceClient()
  const { data } = await supabase.from('knowledge_sources').select('id, type, title, status, chunk_count, error_message, created_at').eq('bot_id', botId).eq('user_id', user.id).is('deleted_at', null).order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}
