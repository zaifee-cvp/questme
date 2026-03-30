import { NextResponse } from 'next/server'
import { getServerUser, createServiceClient } from '@/lib/supabase/server'
import { PLAN_LIMITS } from '@/lib/billing/limits'

export async function GET() {
  try {
    const user = await getServerUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const db = createServiceClient()

    const { data: profile } = await db
      .from('profiles')
      .select('company_id, companies(subscription_status, subscription_plan)')
      .eq('id', user.id)
      .single()

    const company = (profile as any)?.companies
    const status: string | null = company?.subscription_status ?? null
    const plan: string | null = company?.subscription_plan ?? null

    let planKey: keyof typeof PLAN_LIMITS = 'starter'
    if (!status || status === 'canceled' || status === 'incomplete' || status === 'incomplete_expired') {
      planKey = 'cancelled'
    } else if (status === 'trialing') {
      planKey = 'trial'
    } else if (plan && plan in PLAN_LIMITS) {
      planKey = plan as keyof typeof PLAN_LIMITS
    }

    const limits = PLAN_LIMITS[planKey]
    const companyId = profile?.company_id

    // Fetch usage counts in parallel
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [techRes, reportRes, adminRes] = await Promise.all([
      limits.technicians !== -1
        ? db.from('technicians').select('id', { count: 'exact', head: true }).eq('company_id', companyId).eq('status', 'active')
        : Promise.resolve({ count: null }),
      limits.reports_per_month !== -1
        ? db.from('work_orders').select('id', { count: 'exact', head: true }).eq('company_id', companyId).gte('created_at', monthStart)
        : Promise.resolve({ count: null }),
      limits.admins !== -1
        ? db.from('profiles').select('id', { count: 'exact', head: true }).eq('company_id', companyId).eq('role', 'admin')
        : Promise.resolve({ count: null }),
    ])

    return NextResponse.json({
      plan: planKey,
      limits,
      usage: {
        technicians: techRes.count ?? 0,
        reports: reportRes.count ?? 0,
        admins: adminRes.count ?? 0,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
