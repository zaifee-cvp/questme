import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { chunkText } from '@/lib/chunker'
import { indexChunks } from '@/lib/rag'

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
    if (!source) return NextResponse.json({ error: 'Failed' }, { status: 500 })
    const buffer = Buffer.from(await file.arrayBuffer())
    processFile(supabase, source.id, botId, buffer, file.name).catch(console.error)
    return NextResponse.json({ sourceId: source.id, status: 'indexing' })
  } catch (err: any) {
    console.error('[POST /api/ingest/file] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function processFile(supabase: any, sourceId: string, botId: string, buffer: Buffer, filename: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse')
    const data = await pdfParse(buffer)
    if (!data.text || data.text.trim().length < 50) throw new Error('Could not extract text from PDF')
    const chunks = chunkText(data.text)
    await indexChunks(sourceId, botId, chunks)
    await supabase.from('knowledge_sources').update({ title: filename, status: 'ready', chunk_count: chunks.length }).eq('id', sourceId)
  } catch (err: any) {
    await supabase.from('knowledge_sources').update({ status: 'failed', error_message: err.message }).eq('id', sourceId)
  }
}
