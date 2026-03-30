import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface PlanLimitBannerProps {
  current: number
  limit: number
  label: string
  icon?: React.ReactNode
  className?: string
}

export function PlanLimitBanner({ current, limit, label, icon, className }: PlanLimitBannerProps) {
  // Don't render for unlimited plans or below 70% usage
  if (limit === -1) return null
  if (limit === 0) return null

  const pct = Math.min(100, Math.round((current / limit) * 100))
  if (pct < 70) return null

  const isAtLimit = pct >= 100
  const isWarning = pct >= 80

  const containerClass = isAtLimit
    ? 'bg-red-50 border-red-200'
    : isWarning
    ? 'bg-amber-50 border-amber-200'
    : 'bg-blue-50 border-blue-200'

  const textClass = isAtLimit ? 'text-red-800' : isWarning ? 'text-amber-800' : 'text-blue-800'
  const subTextClass = isAtLimit ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-blue-600'
  const barClass = isAtLimit ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-blue-500'
  const barBg = isAtLimit ? 'bg-red-200' : isWarning ? 'bg-amber-200' : 'bg-blue-200'

  return (
    <div className={`rounded-xl border p-4 ${containerClass} ${className ?? ''}`}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          {icon && <div className={`flex-shrink-0 ${subTextClass}`}>{icon}</div>}
          <div className="min-w-0">
            <p className={`text-sm font-semibold ${textClass}`}>
              {isAtLimit ? `${label} limit reached` : `${label} limit approaching`}
            </p>
            <p className={`text-xs mt-0.5 ${subTextClass}`}>
              {current} of {limit} used ({pct}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="w-32">
            <div className={`h-2 rounded-full ${barBg} overflow-hidden`}>
              <div
                className={`h-full rounded-full transition-all ${barClass}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <Link
            href="/dashboard/billing"
            className={`inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap ${subTextClass} hover:underline`}
          >
            Upgrade plan <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
