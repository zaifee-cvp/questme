import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { generateQrToken } from '@/lib/qr/generator'

// POST /api/qr/regenerate
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles').select('company_id, role').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { qr_id } = await request.json()
    if (!qr_id) return NextResponse.json({ success: false, error: 'qr_id required' }, { status: 400 })

    const new_token = generateQrToken()

    const { data, error } = await supabase
      .from('qr_codes')
      .update({ qr_token: new_token, status: 'active', last_used_at: null })
      .eq('id', qr_id)
      .eq('company_id', profile.company_id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
