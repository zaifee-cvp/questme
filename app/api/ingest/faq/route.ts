import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { indexChunks } from '@/lib/rag'

export async function POST(req: NextRequest) {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = createSupabaseServiceClient()
    const { botId, faqs }: { botId: string; faqs: { question: string; answer: string }[] } = await req.json()
    if (!botId || !faqs?.length) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const { data: bot } = await supabase.from('bots').select('id').eq('id', botId).eq('user_id', user.id).single()
    if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    const title = `FAQ (${faqs.length} questions)`
    const combined = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')
    const { data: source } = await supabase.from('knowledge_sources').insert({ bot_id: botId, user_id: user.id, type: 'faq', title, content: combined, status: 'indexing' }).select().single()
    if (!source) return NextResponse.json({ error: 'Failed' }, { status: 500 })
    try {
      const chunks = faqs.map(f => `Question: ${f.question}\nAnswer: ${f.answer}`)
      await indexChunks(source.id, botId, chunks)
      await supabase.from('knowledge_sources').update({ status: 'ready', chunk_count: chunks.length }).eq('id', source.id)
    } catch (err: any) {
      await supabase.from('knowledge_sources').update({ status: 'failed', error_message: err.message }).eq('id', source.id)
    }
    return NextResponse.json({ sourceId: source.id })
  } catch (err: any) {
    console.error('[POST /api/ingest/faq] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
