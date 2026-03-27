// app/(public)/pricing/page.tsx
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing for clinics worldwide. Start free, upgrade when ready.',
}

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    period: '14 days',
    description: 'Full features included',
    features: [
      '1 bot per channel',
      '50 bookings',
      'Google Calendar sync',
      'AI Receptionist',
      'Telegram bot',
    ],
    cta: 'Start free trial',
    href: '/signup',
    note: 'No card needed',
    dark: false,
    featured: false,
  },
  {
    name: 'Starter',
    price: '$88',
    period: 'USD/month',
    description: 'For solo clinics',
    features: [
      'Telegram only',
      'Up to 100 bookings/month',
      'Up to 5 services',
      'Up to 200 customers',
      'Google Calendar',
      'Email support',
    ],
    cta: 'Get Starter',
    href: '/signup?plan=starter',
    note: null,
    dark: false,
    featured: false,
  },
  {
    name: 'Pro',
    price: '$168',
    period: 'USD/month',
    description: 'For growing clinics',
    features: [
      'Telegram bot',
      'Unlimited bookings',
      'Unlimited services',
      'Unlimited customers',
      'Google and Outlook calendar',
      'Channel analytics',
      'Auto handoffs',
      'White-label',
      'Priority chat support',
    ],
    cta: 'Get Pro',
    href: '/signup?plan=pro',
    note: null,
    dark: true,
    featured: true,
  },
]

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, you can cancel anytime before your next billing cycle. No cancellation fees.',
  },
  {
    q: 'What currencies do you accept?',
    a: "All major currencies via Stripe. You'll be charged in your local currency.",
  },
  {
    q: 'Is there a setup fee?',
    a: 'No setup fees, ever. Pay only the monthly subscription.',
  },
  {
    q: 'Can I change plans?',
    a: 'Yes, upgrade or downgrade anytime. Changes take effect on your next billing cycle.',
  },
  {
    q: 'What happens after the trial?',
    a: 'You choose a paid plan to continue, or your account pauses. No surprise charges.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* NAV */}
      <nav
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md"
        style={{ borderBottom: '0.5px solid #e7e5e4' }}
      >
        <div className="mx-auto flex h-[52px] max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-[15px] font-medium tracking-[-0.3px] text-stone-800"
          >
            dentalys.ai
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/#features"
              className="text-[13px] text-stone-600 hover:text-stone-800 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-[13px] text-stone-600 hover:text-stone-800 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/pricing"
              className="text-[13px] font-medium text-stone-800"
            >
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-[13px]">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary text-[13px]">
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <section className="px-6 pb-16 pt-20 text-center">
        <h1 className="text-[42px] font-medium tracking-[-1.5px] text-stone-900">
          Simple pricing for clinics worldwide
        </h1>
        <p className="mt-3 text-[17px] text-stone-500">
          Start free. Upgrade when ready. Cancel anytime.
        </p>
        <p className="mt-2 text-[13px] text-stone-400">
          Prices in USD. Charged in your local currency.
        </p>
      </section>

      {/* PLAN CARDS */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl p-8 ${
                plan.dark ? 'bg-[#1a1a1a] text-white' : 'bg-white'
              }`}
              style={plan.dark ? undefined : { border: '0.5px solid #e7e5e4' }}
            >
              {plan.featured && (
                <span className="absolute -top-3 right-6 inline-flex rounded-full bg-teal-600 px-3 py-1 text-[11px] font-medium text-white">
                  Most Popular
                </span>
              )}
              <p
                className={`mb-1 text-[13px] font-medium ${
                  plan.dark ? 'text-stone-400' : 'text-stone-400'
                }`}
              >
                {plan.name}
              </p>
              <p
                className={`mb-1 text-[42px] font-medium tracking-tight ${
                  plan.dark ? 'text-white' : 'text-stone-900'
                }`}
              >
                {plan.price}
                <span
                  className={`text-[15px] font-normal ${
                    plan.dark ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  {' '}
                  / {plan.period}
                </span>
              </p>
              <p
                className={`mb-6 text-[14px] ${
                  plan.dark ? 'text-stone-400' : 'text-stone-500'
                }`}
              >
                {plan.description}
              </p>
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        plan.dark ? 'text-teal-400' : 'text-teal-500'
                      }`}
                    />
                    <span
                      className={`text-[14px] ${
                        plan.dark ? 'text-stone-300' : 'text-stone-600'
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              {plan.note && (
                <p className="mb-3 text-center text-[12px] text-stone-400">
                  {plan.note}
                </p>
              )}
              <Link
                href={plan.href}
                className={
                  plan.dark
                    ? 'inline-flex w-full items-center justify-center rounded-[20px] bg-white px-6 py-2.5 text-[14px] font-medium text-stone-800 hover:bg-stone-100 transition-colors'
                    : 'btn-outline w-full justify-center text-[14px]'
                }
              >
                {plan.cta}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-center text-[28px] font-medium tracking-[-0.5px] text-stone-900">
            Frequently asked questions
          </h2>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="py-5"
                style={
                  i < faqs.length - 1
                    ? { borderBottom: '0.5px solid #e7e5e4' }
                    : undefined
                }
              >
                <h3 className="mb-1.5 text-[15px] font-medium text-stone-800">
                  {faq.q}
                </h3>
                <p className="text-[14px] leading-relaxed text-stone-500">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="bg-stone-50 px-6 py-12"
        style={{ borderTop: '0.5px solid #e7e5e4' }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <p className="text-[15px] font-medium tracking-[-0.3px] text-stone-800">
              dentalys.ai
            </p>
            <p className="mt-1 text-[13px] text-stone-400">
              Made for clinics worldwide
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-[13px] text-stone-500 hover:text-stone-700 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-[13px] text-stone-500 hover:text-stone-700 transition-colors"
            >
              Login
            </Link>
            <span className="text-[13px] text-stone-500">Privacy</span>
            <span className="text-[13px] text-stone-500">Terms</span>
          </div>
          <p className="text-[12px] text-stone-400">&copy; 2025 dentalys.ai</p>
        </div>
      </footer>
    </div>
  )
}
