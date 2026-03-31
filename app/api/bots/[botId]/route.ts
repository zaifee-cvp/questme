import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET(_req: NextRequest, { params }: { params: { botId: string } }) {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase.from('bots').select('*').eq('id', params.botId).eq('user_id', user.id).is('deleted_at', null).single()
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('[GET /api/bots/[botId]] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { botId: string } }) {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = createSupabaseServiceClient()

    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Strip fields that must not be overwritten
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, user_id: _uid, created_at: _ca, ...safeBody } = body as any

    const { data, error } = await supabase
      .from('bots')
      .update({ ...safeBody, updated_at: new Date().toISOString() })
      .eq('id', params.botId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('[PATCH /api/bots] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { botId: string } }) {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = createSupabaseServiceClient()
    await supabase.from('bots').update({ deleted_at: new Date().toISOString(), is_active: false }).eq('id', params.botId).eq('user_id', user.id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[DELETE /api/bots/[botId]] unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
