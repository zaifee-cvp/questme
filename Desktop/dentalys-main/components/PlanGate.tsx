'use client'

import type { ReactNode } from 'react'
import type { PlanName } from '@/lib/plan-limits'

const PLAN_ORDER: PlanName[] = ['free', 'starter', 'pro']

interface PlanGateProps {
  /** The minimum plan required to see the children. */
  requiredPlan: PlanName
  /** The user's current plan. */
  currentPlan: PlanName
  children: ReactNode
  /** Optional custom message shown in the overlay. */
  upgradeMessage?: string
}

/**
 * Blurs and locks the children behind an upgrade overlay if the user's current
 * plan is below the required plan tier.
 */
export function PlanGate({
  requiredPlan,
  currentPlan,
  children,
  upgradeMessage,
}: PlanGateProps) {
  const currentIndex = PLAN_ORDER.indexOf(currentPlan)
  const requiredIndex = PLAN_ORDER.indexOf(requiredPlan)
  const hasAccess = currentIndex >= requiredIndex

  if (hasAccess) return <>{children}</>

  const planLabel = requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)

  return (
    <div className="relative rounded-lg overflow-hidden">
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none" aria-hidden>
        {children}
      </div>

      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-lg">
        <div className="text-center px-6 py-4">
          <div className="text-3xl mb-2">🔒</div>
          <p className="font-semibold text-gray-900 text-sm">
            {upgradeMessage ?? `Available on the ${planLabel} plan`}
          </p>
          <a
            href="/dashboard/billing"
            className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors"
          >
            Upgrade to {planLabel}
          </a>
        </div>
      </div>
    </div>
  )
}
