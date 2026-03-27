// lib/usage.ts
// Returns current usage counts vs. plan limits for a given business.

import { createClient } from '@/lib/supabase/server'
import { getPlanLimits, type PlanName } from '@/lib/plan-limits'

export interface UsageMetric {
  used: number
  limit: number
  percent: number
}

export interface BusinessUsage {
  plan: PlanName
  customers: UsageMetric
  bookingsThisMonth: UsageMetric
  aiConversationsThisMonth: UsageMetric
  services: UsageMetric
}

function toMetric(used: number, limit: number): UsageMetric {
  const percent = limit === Infinity || limit === 0 ? 0 : Math.round((used / limit) * 100)
  return { used, limit, percent }
}

export async function getBusinessUsage(businessId: string): Promise<BusinessUsage> {
  const supabase = await createClient()

  // Get current plan
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('business_id', businessId)
    .maybeSingle()

  const plan = ((sub?.plan as PlanName) ?? 'free')
  const limits = getPlanLimits(plan)

  // Start of current calendar month
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [
    { count: customerCount },
    { count: bookingCount },
    { count: convCount },
    { count: serviceCount },
  ] = await Promise.all([
    supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId),

    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .gte('created_at', monthStart.toISOString()),

    supabase
      .from('conversation_threads')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .gte('created_at', monthStart.toISOString()),

    supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('is_active', true),
  ])

  return {
    plan,
    customers: toMetric(customerCount ?? 0, limits.maxCustomers),
    bookingsThisMonth: toMetric(bookingCount ?? 0, limits.maxBookingsPerMonth),
    aiConversationsThisMonth: toMetric(convCount ?? 0, limits.maxAiConversationsPerMonth),
    services: toMetric(serviceCount ?? 0, limits.maxServices),
  }
}
