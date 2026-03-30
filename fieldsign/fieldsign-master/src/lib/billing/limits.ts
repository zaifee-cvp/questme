import { createServiceClient } from '@/lib/supabase/server'

export type PlanLimitsShape = { technicians: number; reports_per_month: number; admins: number }

export const PLAN_LIMITS: Record<string, PlanLimitsShape> = {
  trial:     { technicians: 5,  reports_per_month: 50,  admins: 1  },
  starter:   { technicians: 5,  reports_per_month: 100, admins: 1  },
  growth:    { technicians: 20, reports_per_month: -1,  admins: 3  },
  business:  { technicians: -1, reports_per_month: -1,  admins: 10 },
  cancelled: { technicians: 0,  reports_per_month: 0,   admins: 0  },
}

export type PlanLimitKey = 'trial' | 'starter' | 'growth' | 'business' | 'cancelled'

export interface LimitCheckResult {
  allowed: boolean
  current: number
  limit: number
  plan: string
}

function resolvePlanKey(status: string | null, plan: string | null): PlanLimitKey {
  if (!status || status === 'canceled' || status === 'incomplete' || status === 'incomplete_expired' || status === 'unpaid') {
    return 'cancelled'
  }
  if (status === 'trialing') return 'trial'
  if (plan && plan in PLAN_LIMITS) return plan as PlanLimitKey
  return 'starter'
}

export async function checkLimit(
  company_id: string,
  resource: 'technicians' | 'reports' | 'admins'
): Promise<LimitCheckResult> {
  const db = createServiceClient()

  const { data: company } = await db
    .from('companies')
    .select('subscription_status, subscription_plan')
    .eq('id', company_id)
    .single()

  const planKey = resolvePlanKey(
    company?.subscription_status ?? null,
    company?.subscription_plan ?? null
  )
  const limits = PLAN_LIMITS[planKey]

  let current = 0

  if (resource === 'technicians') {
    const limitVal = limits.technicians
    if (limitVal !== -1) {
      const { count } = await db
        .from('technicians')
        .select('id', { count: 'exact', head: true })
        .eq('company_id', company_id)
        .eq('status', 'active')
      current = count ?? 0
    }
    return {
      allowed: limitVal === -1 || current < limitVal,
      current,
      limit: limitVal,
      plan: planKey,
    }
  }

  if (resource === 'reports') {
    const limitVal = limits.reports_per_month
    if (limitVal !== -1) {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const { count } = await db
        .from('work_orders')
        .select('id', { count: 'exact', head: true })
        .eq('company_id', company_id)
        .gte('created_at', monthStart)
      current = count ?? 0
    }
    return {
      allowed: limitVal === -1 || current < limitVal,
      current,
      limit: limitVal,
      plan: planKey,
    }
  }

  // admins
  const limitVal = limits.admins
  if (limitVal !== -1) {
    const { count } = await db
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', company_id)
      .eq('role', 'admin')
    current = count ?? 0
  }
  return {
    allowed: limitVal === -1 || current < limitVal,
    current,
    limit: limitVal,
    plan: planKey,
  }
}
