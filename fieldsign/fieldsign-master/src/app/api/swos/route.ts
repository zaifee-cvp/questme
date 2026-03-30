import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceClient } from '@/lib/supabase/server'

// POST /api/swos - Create a new SWO with server-side number generation
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles').select('company_id, role').eq('id', user.id).single()
    if (!profile) return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 })

    const body = await request.json()
    const serviceClient = createServiceClient()

    // Generate SWO number atomically using DB function
    const { data: swoNoResult, error: swoNoError } = await serviceClient
      .rpc('generate_swo_number', { p_company_id: profile.company_id })

    if (swoNoError || !swoNoResult) {
      return NextResponse.json({ success: false, error: 'Failed to generate SWO number' }, { status: 500 })
    }

    const { data: swo, error } = await serviceClient
      .from('swos')
      .insert({
        company_id: profile.company_id,
        swo_no: swoNoResult,
        client_id: body.client_id || null,
        service_id: body.service_id || null,
        technician_id: body.technician_id || null,
        created_by_user_id: user.id,
        source_type: body.source_type ?? 'admin',
        service_address: body.service_address || null,
        job_instructions: body.job_instructions || null,
        scheduled_date: body.scheduled_date || null,
        status: body.technician_id ? 'Assigned' : 'New',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data: swo })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
