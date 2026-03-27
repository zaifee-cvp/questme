// lib/plan-limits.ts
// Plan feature limits for all Dentalys subscription tiers.

export type PlanName = 'free' | 'starter' | 'pro'

export interface PlanLimits {
  maxCustomers: number
  maxBookingsPerMonth: number
  maxAiConversationsPerMonth: number
  maxServices: number
  telegramEnabled: boolean
  whatsappEnabled: boolean
  googleCalendarEnabled: boolean
  prioritySupport: boolean
}

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  free: {
    maxCustomers: 50,
    maxBookingsPerMonth: 30,
    maxAiConversationsPerMonth: 100,
    maxServices: 3,
    telegramEnabled: true,
    whatsappEnabled: false,
    googleCalendarEnabled: false,
    prioritySupport: false,
  },
  starter: {
    maxCustomers: 500,
    maxBookingsPerMonth: 200,
    maxAiConversationsPerMonth: 1000,
    maxServices: 10,
    telegramEnabled: true,
    whatsappEnabled: true,
    googleCalendarEnabled: true,
    prioritySupport: false,
  },
  pro: {
    maxCustomers: Infinity,
    maxBookingsPerMonth: Infinity,
    maxAiConversationsPerMonth: Infinity,
    maxServices: Infinity,
    telegramEnabled: true,
    whatsappEnabled: true,
    googleCalendarEnabled: true,
    prioritySupport: true,
  },
}

export function getPlanLimits(plan: string): PlanLimits {
  return PLAN_LIMITS[(plan as PlanName)] ?? PLAN_LIMITS.free
}

export function isWithinLimit(used: number, limit: number): boolean {
  return limit === Infinity || used < limit
}

export function getUsagePercent(used: number, limit: number): number {
  if (limit === Infinity || limit === 0) return 0
  return Math.round((used / limit) * 100)
}
