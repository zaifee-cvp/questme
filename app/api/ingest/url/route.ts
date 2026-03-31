import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { crawlUrl } from '@/lib/crawler'
import { chunkText } from '@/lib/chunker'
import { indexChunks } from '@/lib/rag'

export async function POST(req: NextRequest) {
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
  processUrl(supabase, source.id, botId, validUrl.href).catch(console.error)
  return NextResponse.json({ sourceId: source.id, status: 'indexing' })
}

async function processUrl(supabase: any, sourceId: string, botId: string, url: string) {
  try {
    const { title, content } = await crawlUrl(url)
    await supabase.from('knowledge_sources').update({ title, status: 'indexing' }).eq('id', sourceId)
    const chunks = chunkText(content)
    await indexChunks(sourceId, botId, chunks)
    await supabase.from('knowledge_sources').update({ status: 'ready', chunk_count: chunks.length, updated_at: new Date().toISOString() }).eq('id', sourceId)
  } catch (err: any) {
    await supabase.from('knowledge_sources').update({ status: 'failed', error_message: err.message }).eq('id', sourceId)
  }
}
