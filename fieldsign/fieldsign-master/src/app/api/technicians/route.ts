import { NextResponse } from 'next/server'
import { getServerUser, createServiceClient } from '@/lib/supabase/server'
import { checkLimit } from '@/lib/billing/limits'

export async function POST(req: Request) {
  try {
    const user = await getServerUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const db = createServiceClient()

    const { data: profile } = await db
      .from('profiles')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const company_id = profile.company_id

    // Check plan limit before inserting
    const limitCheck = await checkLimit(company_id, 'technicians')
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Plan limit reached. Your ${limitCheck.plan} plan allows ${limitCheck.limit} active technician${limitCheck.limit === 1 ? '' : 's'}.`,
          limit: limitCheck.limit,
          current: limitCheck.current,
          plan: limitCheck.plan,
          upgrade_url: '/dashboard/billing',
        },
        { status: 409 }
      )
    }

    const body = await req.json()
    const { name, email, phone, employee_id, status } = body

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
    }

    const { data: technician, error } = await db
      .from('technicians')
      .insert({
        company_id,
        name: name.trim(),
        email: email || null,
        phone: phone || null,
        employee_id: employee_id || null,
        status: status ?? 'active',
      })
      .select()
      .single()

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, data: technician })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
