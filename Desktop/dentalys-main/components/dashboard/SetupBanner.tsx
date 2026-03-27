// components/dashboard/SetupBanner.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'
import type { SetupProgress } from '@/types'

interface SetupBannerProps {
  setupProgress: SetupProgress
  slug: string
}

const STEPS: {
  key: keyof SetupProgress
  label: string
  href: string
}[] = [
  { key: 'profile', label: 'Complete profile', href: '/onboarding' },
  { key: 'services', label: 'Add services', href: '/onboarding' },
  { key: 'promotion', label: 'Set up promotion', href: '/onboarding' },
  { key: 'telegram', label: 'Connect Telegram', href: '/dashboard/telegram' },
  { key: 'calendar', label: 'Connect Calendar', href: '/dashboard/calendar' },
]

export function SetupBanner({ setupProgress }: SetupBannerProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('setup_banner_dismissed')
    if (!dismissed) setVisible(true)
  }, [])

  const completedCount = STEPS.filter(
    (s) => setupProgress[s.key]
  ).length

  const allDone = completedCount === STEPS.length
  if (allDone || !visible) return null

  const incompleteSteps = STEPS.filter((s) => !setupProgress[s.key])

  const handleDismiss = () => {
    localStorage.setItem('setup_banner_dismissed', 'true')
    setVisible(false)
  }

  return (
    <div
      className="mb-6 rounded-2xl bg-amber-50 p-5 animate-fadeIn"
      style={{ border: '0.5px solid #fde68a' }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-medium text-stone-800">
            Complete your setup
          </h3>
          <p className="text-[12px] text-stone-500">
            {completedCount} of {STEPS.length} done
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="rounded-lg p-1 text-stone-400 hover:bg-amber-100 hover:text-stone-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-4 h-1 w-full rounded-full bg-amber-200">
        <div
          className="h-full rounded-full bg-amber-500 transition-all"
          style={{
            width: `${(completedCount / STEPS.length) * 100}%`,
          }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {incompleteSteps.map((step) => (
          <Link
            key={step.key}
            href={step.href}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-stone-700 hover:bg-amber-100 transition-colors"
            style={{ border: '0.5px solid #e7e5e4' }}
          >
            {step.label}
            <ArrowRight className="h-3 w-3" />
          </Link>
        ))}
      </div>
    </div>
  )
}
