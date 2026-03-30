import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { generateQrToken } from '@/lib/qr/generator'

// POST /api/qr/create
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

    const body = await request.json()
    const { technician_id } = body
    if (!technician_id) return NextResponse.json({ success: false, error: 'technician_id required' }, { status: 400 })

    // Verify technician belongs to same company
    const { data: tech } = await supabase
      .from('technicians')
      .select('id')
      .eq('id', technician_id)
      .eq('company_id', profile.company_id)
      .single()

    if (!tech) return NextResponse.json({ success: false, error: 'Technician not found' }, { status: 404 })

    const qr_token = generateQrToken()

    const { data, error } = await supabase
      .from('qr_codes')
      .insert({
        company_id: profile.company_id,
        technician_id,
        qr_token,
        status: 'active',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
