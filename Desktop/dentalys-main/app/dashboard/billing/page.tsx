// app/dashboard/billing/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
} from 'lucide-react'

const PLANS = {
  starter: {
    name: 'Starter',
    price: 88,
    description: 'For solo dental clinics',
    features: [
      'AI dental receptionist 24/7',
      'Telegram bot integration',
      'Up to 100 bookings/month',
      '28 dental service templates',
      'Google Calendar sync',
      'Email support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 168,
    description: 'For growing clinics',
    features: [
      'Everything in Starter',
      'Unlimited bookings',
      'Unlimited services',
      'White-label bot persona',
      'Channel analytics',
      'Auto patient handoffs',
      'Priority chat support',
      'Custom welcome messages',
    ],
  },
} as const

export default function BillingPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [redirecting, setRedirecting] = useState<string | null>(null)
  const [upgradeError, setUpgradeError] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<{
    plan: string
    status: string
    trial_end: string | null
    current_period_end: string | null
    cancel_at_period_end: boolean
  } | null>(null)

  const loadData = useCallback(async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id')
      .single()
    if (!profile?.business_id) return

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan, status, trial_end, current_period_end, cancel_at_period_end')
      .eq('business_id', profile.business_id)
      .maybeSingle()

    if (sub) setSubscription(sub)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleUpgrade = async (planKey: string) => {
    setRedirecting(planKey)
    setUpgradeError(null)
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setUpgradeError(data.error || 'Failed to start checkout. Please try again.')
      }
    } catch {
      setUpgradeError('Network error. Please check your connection and try again.')
    } finally {
      setRedirecting(null)
    }
  }

  const handleManage = async () => {
    setRedirecting('portal')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } finally {
      setRedirecting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
      </div>
    )
  }

  const currentPlan = subscription?.plan || 'free'
  const status = subscription?.status || 'trialing'
  const isActive = status === 'active' || status === 'trialing'
  const isPaid = currentPlan === 'starter' || currentPlan === 'pro'

  // Trial progress
  const trialDaysTotal = 14
  const trialDaysRemaining =
    subscription?.trial_end && status === 'trialing'
      ? Math.max(0, Math.ceil((new Date(subscription.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : 0
  const trialDaysUsed = trialDaysTotal - trialDaysRemaining
  const trialProgress = Math.min(100, (trialDaysUsed / trialDaysTotal) * 100)

  const borderColor = isActive ? '#0d9488' : '#fca5a5'
  const borderStyle = isActive
    ? '1.5px solid #0d9488'
    : '1.5px solid #fca5a5'

  return (
    <div className="mx-auto max-w-3xl space-y-8">

      {/* Current Plan Card */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: borderStyle }}
      >
        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isActive ? 'bg-teal-50' : 'bg-red-50'}`}>
            <CreditCard className={`h-5 w-5 ${isActive ? 'text-teal-600' : 'text-red-500'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[15px] font-medium text-stone-800">Current Plan</h2>
              <span className="text-[13px] font-semibold capitalize text-stone-700">{currentPlan}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  status === 'active'
                    ? 'bg-emerald-50 text-emerald-700'
                    : status === 'trialing'
                    ? 'bg-teal-50 text-teal-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {status}
              </span>
            </div>

            {/* Trial progress bar */}
            {status === 'trialing' && subscription?.trial_end && (
              <div className="mt-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[12px] text-stone-500">
                    {trialDaysRemaining > 0
                      ? `${trialDaysRemaining} day${trialDaysRemaining !== 1 ? 's' : ''} remaining in trial`
                      : 'Trial period ended'}
                  </span>
                  <span className="text-[12px] text-stone-400">{trialDaysUsed}/{trialDaysTotal} days used</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-stone-100">
                  <div
                    className="h-1.5 rounded-full bg-teal-500 transition-all"
                    style={{ width: `${trialProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Paid plan renewal */}
            {isPaid && subscription?.current_period_end && (
              <p className="mt-1.5 text-[12px] text-stone-400">
                {subscription.cancel_at_period_end ? 'Cancels' : 'Renews'} on{' '}
                {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
                })}
              </p>
            )}
          </div>

          {isPaid && (
            <button
              onClick={handleManage}
              disabled={redirecting === 'portal'}
              className="btn-outline shrink-0 text-[13px]"
            >
              {redirecting === 'portal' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Manage'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-[22px] font-medium tracking-[-0.4px] text-stone-900">
          Choose your plan
        </h1>
        <p className="mt-1 text-[14px] text-stone-500">
          Upgrade anytime, cancel anytime
        </p>
      </div>

      {/* Error banner */}
      {upgradeError && (
        <div
          className="flex items-center gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-700"
          style={{ border: '0.5px solid #fecaca' }}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {upgradeError}
        </div>
      )}

      {/* Plan cards */}
      <div className="grid gap-5 sm:grid-cols-2">
        {(Object.entries(PLANS) as [keyof typeof PLANS, typeof PLANS[keyof typeof PLANS]][]).map(
          ([key, plan]) => {
            const isCurrent = currentPlan === key
            const isPro = key === 'pro'
            return (
              <div
                key={key}
                className={`relative flex flex-col rounded-2xl bg-white p-7 ${
                  isPro ? 'shadow-md' : ''
                }`}
                style={{
                  border: isPro ? '1.5px solid #0d9488' : '0.5px solid #e7e5e4',
                }}
              >
                {/* Most Popular badge */}
                {isPro && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-teal-600 px-3 py-1 text-[11px] font-medium text-white">
                    <Sparkles className="h-3 w-3" /> Most Popular
                  </span>
                )}

                {/* Plan header */}
                <div className="mb-5">
                  <p className="text-[12px] font-medium uppercase tracking-wider text-stone-400">
                    {plan.name}
                  </p>
                  <p className="mt-1">
                    <span className="text-[38px] font-medium tracking-tight text-stone-900">
                      ${plan.price}
                    </span>
                    <span className="text-[13px] text-stone-400"> / month</span>
                  </p>
                  <p className="mt-0.5 text-[13px] text-stone-500">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="mb-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${isPro ? 'text-teal-500' : 'text-emerald-500'}`} />
                      <span className="text-[13px] text-stone-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="mb-5 border-t border-stone-100" />

                {/* CTA */}
                {isCurrent ? (
                  <span className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-teal-600">
                    <CheckCircle2 className="h-4 w-4" /> Current plan
                  </span>
                ) : (
                  <button
                    onClick={() => handleUpgrade(key)}
                    disabled={!!redirecting}
                    className={`flex w-full items-center justify-center gap-2 rounded-[20px] px-6 py-2.5 text-[14px] font-medium transition-colors disabled:opacity-50 ${
                      isPro
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-stone-900 text-white hover:bg-stone-800'
                    }`}
                  >
                    {redirecting === key ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Get {plan.name} <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )
          }
        )}
      </div>

      {/* Footer note */}
      <p className="text-center text-[12px] text-stone-400">
        All plans include 14-day free trial · No credit card required to start · Cancel anytime
      </p>
    </div>
  )
}
