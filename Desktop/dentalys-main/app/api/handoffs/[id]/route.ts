// app/api/handoffs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { status } = await request.json()
  if (!status || !['acknowledged', 'resolved'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('business_id')
    .eq('id', user.id)
    .single()
  if (!profile?.business_id) {
    return NextResponse.json({ error: 'No business found' }, { status: 400 })
  }

  // Verify handoff belongs to this business
  const { data: handoff } = await supabase
    .from('handoff_requests')
    .select('id')
    .eq('id', id)
    .eq('business_id', profile.business_id)
    .single()

  if (!handoff) {
    return NextResponse.json({ error: 'Handoff not found' }, { status: 404 })
  }

  const { error } = await supabase
    .from('handoff_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
