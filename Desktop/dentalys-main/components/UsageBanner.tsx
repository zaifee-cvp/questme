'use client'

import { useEffect, useState } from 'react'
import type { BusinessUsage } from '@/lib/usage'

const WARNING_THRESHOLD = 80 // percent

export function UsageBanner() {
  const [usage, setUsage] = useState<BusinessUsage | null>(null)

  useEffect(() => {
    fetch('/api/usage')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: BusinessUsage | null) => setUsage(data))
      .catch(() => null)
  }, [])

  if (!usage) return null

  // Find which metrics are at or above the warning threshold
  const warnings: string[] = []

  const metrics: { label: string; metric: BusinessUsage[keyof BusinessUsage] }[] = [
    { label: 'customers', metric: usage.customers },
    { label: 'bookings this month', metric: usage.bookingsThisMonth },
    { label: 'AI conversations this month', metric: usage.aiConversationsThisMonth },
    { label: 'services', metric: usage.services },
  ]

  for (const { label, metric } of metrics) {
    if (
      typeof metric === 'object' &&
      metric !== null &&
      'percent' in metric &&
      (metric as { percent: number }).percent >= WARNING_THRESHOLD
    ) {
      const m = metric as { used: number; limit: number; percent: number }
      const limitStr = m.limit === Infinity ? '∞' : String(m.limit)
      warnings.push(`${label} (${m.used} / ${limitStr})`)
    }
  }

  if (warnings.length === 0) return null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3 text-sm text-amber-800">
      <span className="text-lg leading-none mt-0.5">⚠️</span>
      <div>
        <p className="font-medium">You&apos;re approaching your plan limits</p>
        <p className="text-amber-700 mt-0.5">
          Near limit: {warnings.join(', ')}.{' '}
          <a href="/dashboard/billing" className="underline font-medium">
            Upgrade your plan →
          </a>
        </p>
      </div>
    </div>
  )
}
