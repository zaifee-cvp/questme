import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { crawlUrl } from '@/lib/crawler'
import { chunkText } from '@/lib/chunker'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = createSupabaseServiceClient()
    const { botId, url } = await req.json()
    if (!botId || !url) return NextResponse.json({ error: 'Missing botId or url' }, { status: 400 })
    let validUrl: URL
    try { validUrl = new URL(url) } catch { return NextResponse.json({ error: 'Invalid URL' }, { status: 400 }) }
    const { data: bot } = await supabase.from('bots').select('id').eq('id', botId).eq('user_id', user.id).is('deleted_at', null).single()
    if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    const { data: source } = await supabase.from('knowledge_sources').insert({ bot_id: botId, user_id: user.id, type: 'url', title: validUrl.hostname + validUrl.pathname, url: validUrl.href, status: 'indexing' }).select().single()
    if (!source) return NextResponse.json({ error: 'Failed to create source' }, { status: 500 })

    try {
      const { title, content } = await crawlUrl(validUrl.href)
      await supabase.from('knowledge_sources').update({ title }).eq('id', source.id)
      const chunks = chunkText(content)
      if (chunks.length === 0) throw new Error('No meaningful content extracted')
      for (const chunk of chunks) {
        await supabase.from('knowledge_chunks').insert({
          source_id: source.id,
          bot_id: botId,
          content: chunk,
          embedding: null,
        })
      }
      await supabase.from('knowledge_sources').update({ status: 'processing', chunk_count: chunks.length, updated_at: new Date().toISOString() }).eq('id', source.id)
      return NextResponse.json({ sourceId: source.id, status: 'processing', totalChunks: chunks.length })
    } catch (err: any) {
      console.error('[ingest/url] error:', err)
      await supabase.from('knowledge_sources').update({ status: 'failed', error_message: err.message || 'Failed' }).eq('id', source.id)
      return NextResponse.json({ sourceId: source.id, status: 'failed' }, { status: 422 })
    }
  } catch (err: any) {
    console.error('[POST /api/ingest/url] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
