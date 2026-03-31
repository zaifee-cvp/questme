import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { embedText } from '@/lib/rag'

export async function POST(req: NextRequest) {
  // Auth check using cookie-based client
  const cookieStore = cookies()
  const authClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Service client for storage — initialized inline with sb_secret_ key support
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const botId = formData.get('botId') as string | null
  const description = (formData.get('description') as string | null)?.trim() ?? ''

  if (!file || !botId) return NextResponse.json({ error: 'Missing file or botId' }, { status: 400 })
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only image files are supported' }, { status: 400 })
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Image too large (max 10MB)' }, { status: 400 })

  const { data: bot } = await supabase.from('bots').select('id').eq('id', botId).eq('user_id', user.id).single()
  if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })

  // Upload to Supabase Storage
  const ext = file.name.split('.').pop() ?? 'jpg'
  const fileName = `${user.id}/${botId}/${Date.now()}.${ext}`
  const fileBuffer = Buffer.from(await file.arrayBuffer())

  const { error: storageError } = await supabase.storage
    .from('knowledge-images')
    .upload(fileName, fileBuffer, {
      contentType: file.type,
      upsert: true,
    })

  if (storageError) {
    console.error('[ingest/image] storage error:', storageError.message)
    return NextResponse.json({ error: 'Failed to upload image: ' + storageError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('knowledge-images')
    .getPublicUrl(fileName)

  // Content the AI will retrieve via vector search
  const content = [
    `Image: ${file.name}`,
    description ? `Description: ${description}` : null,
    `Image URL: ${publicUrl}`,
  ].filter(Boolean).join('\n')

  // Insert knowledge_source with status='indexing' until chunk is saved
  const { data: source, error: insertError } = await supabase
    .from('knowledge_sources')
    .insert({ bot_id: botId, user_id: user.id, type: 'image', title: file.name, status: 'indexing', chunk_count: 0 })
    .select()
    .single()

  if (!source || insertError) {
    console.error('[ingest/image] source insert error:', insertError?.message)
    return NextResponse.json({ error: 'Failed to save source' }, { status: 500 })
  }

  // Step 1: Insert chunk with content (embedding nullable — always succeeds)
  const { data: chunk, error: chunkError } = await supabase
    .from('knowledge_chunks')
    .insert({ source_id: source.id, bot_id: botId, content })
    .select('id')
    .single()

  if (!chunk || chunkError) {
    console.error('[ingest/image] chunk insert error:', chunkError?.message)
    // Still mark source as ready with 0 chunks so UI doesn't hang on indexing
    await supabase.from('knowledge_sources').update({ status: 'ready', chunk_count: 0 }).eq('id', source.id)
    return NextResponse.json({ success: true, sourceId: source.id, publicUrl, warning: 'Chunk not indexed' })
  }

  // Step 2: Mark source ready now that chunk exists
  await supabase
    .from('knowledge_sources')
    .update({ status: 'ready', chunk_count: 1 })
    .eq('id', source.id)

  // Step 3: Generate embedding and attach — failure is non-fatal
  try {
    const embedding = await embedText(content)
    await supabase
      .from('knowledge_chunks')
      .update({ embedding })
      .eq('id', chunk.id)
  } catch (err) {
    console.error('[ingest/image] embedding error:', err)
    // Chunk content is still saved; vector search won't find it until embedding is set
  }

  return NextResponse.json({ success: true, sourceId: source.id, publicUrl })
}
