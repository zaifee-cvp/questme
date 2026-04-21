import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { botId: string; leadId: string } }
) {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createSupabaseServiceClient()
    const { data: bot } = await supabase.from('bots').select('id').eq('id', params.botId).eq('user_id', user.id).single()
    if (!bot) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', params.leadId)
      .eq('bot_id', params.botId)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 })
  }
}
