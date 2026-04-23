import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { extractTextFromPDF, extractTextFromURL, chunkText } from '@/lib/knowledge-ingest'
import { embedText } from '@/lib/rag'

export const maxDuration = 300

export async function POST(req: NextRequest) {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = createSupabaseServiceClient()

    const contentType = req.headers.get('content-type') || ''
    let botId: string, type: string, title: string
    let content: string | null = null
    let url: string | null = null
    let file: File | null = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      botId = formData.get('botId') as string
      type = formData.get('type') as string
      title = (formData.get('title') as string) || ''
      content = (formData.get('content') as string) || null
      url = (formData.get('url') as string) || null
      file = formData.get('file') as File | null
    } else {
      const body = await req.json()
      botId = body.botId
      type = body.type
      title = body.title || ''
      content = body.content ?? null
      url = body.url ?? null
    }

    if (!botId || !type) return NextResponse.json({ error: 'Missing botId or type' }, { status: 400 })

    const { data: bot } = await supabase.from('bots').select('id').eq('id', botId).eq('user_id', user.id).is('deleted_at', null).single()
    if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })

    const sourceTitle = title || (type === 'url' ? (url ? (new URL(url).hostname + new URL(url).pathname) : 'URL') : type === 'file' ? (file?.name || 'PDF Upload') : 'Text')
    const { data: source } = await supabase.from('knowledge_sources').insert({
      bot_id: botId, user_id: user.id, type, title: sourceTitle,
      ...(url ? { url } : {}),
      status: 'indexing',
    }).select().single()
    if (!source) return NextResponse.json({ error: 'Failed to create source' }, { status: 500 })

    try {
      let text = ''

      if (type === 'url') {
        if (!url) throw new Error('URL is required')
        text = await extractTextFromURL(url)
      } else if (type === 'file') {
        if (!file) throw new Error('File is required')
        if (file.size > 10 * 1024 * 1024) throw new Error('File too large (max 10MB)')
        if (!file.name.toLowerCase().endsWith('.pdf') && !file.type.includes('pdf')) throw new Error('Only PDF files are supported')
        const buffer = Buffer.from(await file.arrayBuffer())
        text = await extractTextFromPDF(buffer)
      } else if (type === 'text') {
        if (!content) throw new Error('Content is required')
        text = content
      } else {
        throw new Error(`Unsupported type: ${type}`)
      }

      if (!text || text.trim().length < 50) throw new Error('Could not extract meaningful content')

      const chunks = chunkText(text)
      if (chunks.length === 0) throw new Error('No meaningful content extracted')

      for (const chunk of chunks) {
        let embedding: number[] | null = null
        try { embedding = await embedText(chunk) } catch (e: any) {
          console.warn('[knowledge/ingest] embedding failed, storing without embedding:', e.message)
        }
        await supabase.from('knowledge_chunks').insert({ source_id: source.id, bot_id: botId, content: chunk, embedding })
      }

      await supabase.from('knowledge_sources').update({ status: 'ready', chunk_count: chunks.length, updated_at: new Date().toISOString() }).eq('id', source.id)
      return NextResponse.json({ sourceId: source.id, status: 'ready', chunkCount: chunks.length })
    } catch (err: any) {
      console.error('[knowledge/ingest] processing error:', err)
      await supabase.from('knowledge_sources').update({ status: 'failed', error_message: err.message }).eq('id', source.id)
      return NextResponse.json({ sourceId: source.id, status: 'failed', error: err.message }, { status: 422 })
    }
  } catch (err: any) {
    console.error('[POST /api/knowledge/ingest] unhandled error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
