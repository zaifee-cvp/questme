import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { embedText } from '@/lib/rag'

export async function POST(req: NextRequest) {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = createSupabaseServiceClient()
    const { sourceId } = await req.json()
    if (!sourceId) return NextResponse.json({ error: 'Missing sourceId' }, { status: 400 })

    // Find one chunk without embedding
    const { data: chunk } = await supabase
      .from('knowledge_chunks')
      .select('id, content')
      .eq('source_id', sourceId)
      .is('embedding', null)
      .limit(1)
      .single()

    if (!chunk) {
      // All done — mark source as ready
      const { count } = await supabase.from('knowledge_chunks').select('id', { count: 'exact', head: true }).eq('source_id', sourceId)
      await supabase.from('knowledge_sources').update({ status: 'ready', chunk_count: count || 0, updated_at: new Date().toISOString() }).eq('id', sourceId)
      return NextResponse.json({ done: true, remaining: 0 })
    }

    const embedding = await embedText(chunk.content)
    await supabase.from('knowledge_chunks').update({ embedding }).eq('id', chunk.id)

    const { count } = await supabase.from('knowledge_chunks').select('id', { count: 'exact', head: true }).eq('source_id', sourceId).is('embedding', null)
    return NextResponse.json({ done: false, remaining: count || 0 })
  } catch (err: any) {
    console.error('[embed-next] error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
