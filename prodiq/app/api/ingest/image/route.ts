import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { indexChunks } from '@/lib/rag'

export async function POST(req: NextRequest) {
  const authClient = createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseServiceClient()
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const botId = formData.get('botId') as string | null
  const description = (formData.get('description') as string | null)?.trim() ?? ''

  if (!file || !botId) return NextResponse.json({ error: 'Missing file or botId' }, { status: 400 })
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only image files are supported' }, { status: 400 })
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Image too large (max 5MB)' }, { status: 400 })
  if (!description) return NextResponse.json({ error: 'Description is required' }, { status: 400 })

  const { data: bot } = await supabase.from('bots').select('id').eq('id', botId).eq('user_id', user.id).single()
  if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })

  // Upload to Supabase Storage
  const ext = file.name.split('.').pop() ?? 'jpg'
  const storagePath = `${user.id}/${botId}/${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: storageError } = await supabase.storage
    .from('knowledge-images')
    .upload(storagePath, buffer, { contentType: file.type, upsert: false })

  if (storageError) {
    console.error('[ingest/image] storage error:', storageError.message)
    return NextResponse.json({ error: 'Failed to upload image: ' + storageError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from('knowledge-images').getPublicUrl(storagePath)

  // Content that the AI will retrieve
  const content = `Image: ${file.name}\nDescription: ${description}\nURL: ${publicUrl}`

  const { data: source, error: insertError } = await supabase
    .from('knowledge_sources')
    .insert({ bot_id: botId, user_id: user.id, type: 'image', title: file.name, status: 'ready', chunk_count: 1 })
    .select()
    .single()

  if (!source || insertError) return NextResponse.json({ error: 'Failed to save source' }, { status: 500 })

  await indexChunks(source.id, botId, [content])

  return NextResponse.json({ success: true, sourceId: source.id, publicUrl })
}
