import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// GET /api/technician/validate?token=xxx
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ success: false, error: 'Token required' }, { status: 400 })
  }

  try {
    const serviceClient = createServiceClient()
    const { data, error } = await serviceClient.rpc('validate_qr_token', { p_token: token })

    if (error || !data || data.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid or expired QR code' }, { status: 401 })
    }

    const result = data[0]
    return NextResponse.json({ success: true, data: result })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
