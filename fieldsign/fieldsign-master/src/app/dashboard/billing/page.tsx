import { getServerProfile, createServiceClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/stripe/server'
import { PLAN_LIMITS } from '@/lib/billing/limits'
import { checkLimit } from '@/lib/billing/limits'
import { CheckoutButton, ManageBillingButton } from '@/components/admin/billing-client'
import {
  CheckCircle, AlertTriangle, XCircle, Clock,
  Wrench, BarChart3, Users, ArrowUpRight,
} from 'lucide-react'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function daysUntil(iso: string | null): number {
  if (!iso) return 0
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
}

function StatusBadge({ status }: { status: string | null }) {
  const map: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    trialing:  { color: 'bg-blue-100 text-blue-700',     icon: <Clock className="h-4 w-4" />,           label: 'Free Trial'  },
    active:    { color: 'bg-green-100 text-green-700',   icon: <CheckCircle className="h-4 w-4" />,     label: 'Active'      },
    past_due:  { color: 'bg-yellow-100 text-yellow-700', icon: <AlertTriangle className="h-4 w-4" />,   label: 'Past Due'    },
    canceled:  { color: 'bg-red-100 text-red-700',       icon: <XCircle className="h-4 w-4" />,         label: 'Canceled'    },
    cancelled: { color: 'bg-red-100 text-red-700',       icon: <XCircle className="h-4 w-4" />,         label: 'Canceled'    },
  }
  const s = status ? (map[status] ?? { color: 'bg-gray-100 text-gray-600', icon: null, label: status })
                   : { color: 'bg-gray-100 text-gray-600', icon: <XCircle className="h-4 w-4" />, label: 'No Subscription' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${s.color}`}>
      {s.icon} {s.label}
    </span>
  )
}

function UsageBar({
  current, limit, label, icon,
}: {
  current: number
  limit: number
  label: string
  icon: React.ReactNode
}) {
  const unlimited = limit === -1
  const pct = unlimited ? 0 : limit === 0 ? 100 : Math.min(100, Math.round((current / limit) * 100))
  const barColor = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-400' : 'bg-[#1e3a5f]'
  const atLimit = !unlimited && pct >= 100

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="text-gray-400 flex-shrink-0 w-5">{icon}</div>
      <div className="w-36 flex-shrink-0">
        <p className="text-sm font-medium text-gray-700">{label}</p>
      </div>
      <div className="flex-1 min-w-0">
        {unlimited ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-green-100">
              <div className="h-full w-full rounded-full bg-green-400 opacity-40" />
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">Unlimited</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap w-16 text-right">
              {current} / {limit}
            </span>
          </div>
        )}
      </div>
      {atLimit && (
        <a
          href="/dashboard/billing#plans"
          className="text-xs text-red-600 font-medium flex items-center gap-0.5 hover:underline whitespace-nowrap flex-shrink-0"
        >
          Upgrade <ArrowUpRight className="h-3 w-3" />
        </a>
      )}
    </div>
  )
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>
}) {
  const params = await searchParams
  const profile = await getServerProfile() as any
  const company = profile?.companies ?? {}

  const status: string | null = company.subscription_status ?? null
  const plan: string | null = company.subscription_plan ?? null
  const hasStripeCustomer = !!company.stripe_customer_id
  const isActive = status === 'active' || status === 'trialing' || status === 'past_due'

  // Fetch usage for all resources
  const [techUsage, reportUsage, adminUsage] = await Promise.all([
    company.id ? checkLimit(company.id, 'technicians') : Promise.resolve({ current: 0, limit: 5, allowed: true, plan: 'trial' }),
    company.id ? checkLimit(company.id, 'reports')     : Promise.resolve({ current: 0, limit: 50, allowed: true, plan: 'trial' }),
    company.id ? checkLimit(company.id, 'admins')      : Promise.resolve({ current: 0, limit: 1, allowed: true, plan: 'trial' }),
  ])

  const planEntries = Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your plan and billing information</p>
      </div>

      {/* Alerts */}
      {params.success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800 text-sm font-medium">Subscription activated! Your 14-day free trial has started.</p>
        </div>
      )}
      {params.canceled && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <p className="text-yellow-800 text-sm">Checkout was canceled. Your plan has not changed.</p>
        </div>
      )}
      {status === 'past_due' && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800 text-sm font-medium">Your last payment failed. Please update your payment method to keep access.</p>
        </div>
      )}

      {/* Current plan + usage */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Plan</p>
            <p className="text-xl font-bold text-gray-900 capitalize">{plan ?? 'None'}</p>
            <div className="mt-2"><StatusBadge status={status} /></div>
            {status === 'trialing' && company.trial_ends_at && (
              <p className="text-sm text-blue-600 mt-2">
                Trial ends in <strong>{daysUntil(company.trial_ends_at)} days</strong> — {formatDate(company.trial_ends_at)}
              </p>
            )}
            {status === 'active' && company.current_period_end && (
              <p className="text-sm text-gray-500 mt-2">Next billing: {formatDate(company.current_period_end)}</p>
            )}
            {status === 'canceled' && company.current_period_end && (
              <p className="text-sm text-gray-500 mt-2">Access until: {formatDate(company.current_period_end)}</p>
            )}
          </div>
          {hasStripeCustomer && <ManageBillingButton />}
        </div>

        {/* Usage rows */}
        <div className="border border-gray-100 rounded-xl px-4">
          <UsageBar
            current={techUsage.current}
            limit={techUsage.limit}
            label="Technicians"
            icon={<Wrench className="h-4 w-4" />}
          />
          <UsageBar
            current={reportUsage.current}
            limit={reportUsage.limit}
            label="Reports / month"
            icon={<BarChart3 className="h-4 w-4" />}
          />
          <UsageBar
            current={adminUsage.current}
            limit={adminUsage.limit}
            label="Admin seats"
            icon={<Users className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Plan comparison */}
      <div id="plans">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {isActive ? 'Change Plan' : 'Choose a Plan — 14-day free trial'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {planEntries.map(([key, p]) => {
            const isCurrent = plan === key && isActive
            const isPopular = key === 'growth'
            const planLimits = PLAN_LIMITS[key as keyof typeof PLAN_LIMITS]

            return (
              <div
                key={key}
                className={`relative bg-white rounded-xl border p-6 flex flex-col ${
                  isCurrent ? 'border-[#1e3a5f] ring-2 ring-[#1e3a5f]/20'
                  : isPopular ? 'border-[#e05a2b]' : 'border-gray-200'
                }`}
              >
                {isPopular && !isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#e05a2b] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1e3a5f] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Current Plan
                  </span>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 capitalize">{p.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-gray-900">${p.price}</span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                </div>

                {/* Plan limits summary */}
                <div className="mb-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Wrench className="h-3 w-3" />
                    {planLimits.technicians === -1 ? 'Unlimited technicians' : `${planLimits.technicians} technicians`}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <BarChart3 className="h-3 w-3" />
                    {planLimits.reports_per_month === -1 ? 'Unlimited reports/month' : `${planLimits.reports_per_month} reports/month`}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users className="h-3 w-3" />
                    {planLimits.admins === -1 ? 'Unlimited admin seats' : `${planLimits.admins} admin seat${planLimits.admins === 1 ? '' : 's'}`}
                  </div>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="text-center text-sm text-gray-400 font-medium py-2">Current plan</div>
                ) : (
                  <CheckoutButton
                    priceId={p.priceId}
                    label={isActive ? `Switch to ${p.name}` : `Start Free Trial`}
                    variant={isPopular ? 'default' : 'outline'}
                    className="w-full"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        All plans include a 14-day free trial. Cancel anytime. Prices in USD.
      </p>
    </div>
  )
}
