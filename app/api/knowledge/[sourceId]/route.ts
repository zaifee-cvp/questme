import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: { sourceId: string } }) {
  const authClient = createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createSupabaseServiceClient()
  const { data: source, error: srcErr } = await supabase
    .from('knowledge_sources')
    .select('*')
    .eq('id', params.sourceId)
    .eq('user_id', user.id)
    .single()
  if (!source || srcErr) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const { data: chunks } = await supabase
    .from('knowledge_chunks')
    .select('id, content')
    .eq('source_id', params.sourceId)
    .order('created_at', { ascending: true })
  return NextResponse.json({ source, chunks: chunks ?? [] })
}

export async function PATCH(req: NextRequest, { params }: { params: { sourceId: string } }) {
  const authClient = createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const supabase = createSupabaseServiceClient()
  const { error } = await supabase
    .from('knowledge_sources')
    .update({ folder_id: body.folder_id ?? null })
    .eq('id', params.sourceId)
    .eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { sourceId: string } }) {
  const authClient = createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createSupabaseServiceClient()
  const { error } = await supabase.from('knowledge_sources').delete().eq('id', params.sourceId).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
