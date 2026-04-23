import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { chunkText } from '@/lib/chunker'
import { embedText } from '@/lib/rag'
import { extractTextFromPDF } from '@/lib/pdf-extract'

export const maxDuration = 300

export async function POST(req: NextRequest) {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = createSupabaseServiceClient()
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const botId = formData.get('botId') as string | null
    if (!file || !botId) return NextResponse.json({ error: 'Missing file or botId' }, { status: 400 })
    if (!file.name.endsWith('.pdf') && file.type !== 'application/pdf') return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 })
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    const { data: bot } = await supabase.from('bots').select('id').eq('id', botId).eq('user_id', user.id).single()
    if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    const { data: source } = await supabase.from('knowledge_sources').insert({ bot_id: botId, user_id: user.id, type: 'file', title: file.name, status: 'indexing' }).select().single()
    if (!source) return NextResponse.json({ error: 'Failed to create source' }, { status: 500 })

    try {
      const buffer = Buffer.from(await file.arrayBuffer())
      const extractedText = await extractTextFromPDF(buffer)
      if (!extractedText || extractedText.trim().length < 50) throw new Error('Could not extract text from PDF (the PDF may be a scanned image without selectable text)')
      const chunks = chunkText(extractedText)
      if (chunks.length === 0) throw new Error('No meaningful content extracted')
      for (const chunk of chunks) {
        const embedding = await embedText(chunk)
        await supabase.from('knowledge_chunks').insert({ source_id: source.id, bot_id: botId, content: chunk, embedding })
      }
      await supabase.from('knowledge_sources').update({ title: file.name, status: 'ready', chunk_count: chunks.length, updated_at: new Date().toISOString() }).eq('id', source.id)
      return NextResponse.json({ sourceId: source.id, status: 'ready' })
    } catch (err: any) {
      await supabase.from('knowledge_sources').update({ status: 'failed', error_message: err.message }).eq('id', source.id)
      return NextResponse.json({ sourceId: source.id, status: 'failed', error: err.message }, { status: 422 })
    }
  } catch (err: any) {
    console.error('[POST /api/upload-pdf] error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
