import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { indexChunks } from '@/lib/rag'

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
  if (!description) return NextResponse.json({ error: 'Description is required' }, { status: 400 })

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

  // Content the AI will retrieve
  const content = `Image: ${file.name}\nDescription: ${description}\nURL: ${publicUrl}`

  const { data: source, error: insertError } = await supabase
    .from('knowledge_sources')
    .insert({ bot_id: botId, user_id: user.id, type: 'image', title: file.name, status: 'ready', chunk_count: 1 })
    .select()
    .single()

  if (!source || insertError) {
    console.error('[ingest/image] insert error:', insertError?.message)
    return NextResponse.json({ error: 'Failed to save source' }, { status: 500 })
  }

  try {
    await indexChunks(source.id, botId, [content])
  } catch (err) {
    console.error('[ingest/image] indexChunks error:', err)
    // Source was saved, image uploaded — don't fail the whole request
  }

  return NextResponse.json({ success: true, sourceId: source.id, publicUrl })
}
