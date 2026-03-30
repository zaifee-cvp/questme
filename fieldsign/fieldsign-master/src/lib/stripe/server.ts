import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
})

export const PLANS = {
  starter: {
    name: 'Starter',
    priceId: process.env.STRIPE_PRICE_STARTER!,
    price: 29,
    features: ['5 technicians', '100 reports/month', 'Email delivery', 'PDF reports'],
  },
  growth: {
    name: 'Growth',
    priceId: process.env.STRIPE_PRICE_GROWTH!,
    features: ['20 technicians', '500 reports/month', 'Email delivery', 'PDF reports', 'Custom templates'],
    price: 79,
  },
  business: {
    name: 'Business',
    priceId: process.env.STRIPE_PRICE_BUSINESS!,
    price: 149,
    features: ['Unlimited technicians', 'Unlimited reports', 'Email delivery', 'PDF reports', 'Custom templates', 'Priority support'],
  },
} as const

export type PlanKey = keyof typeof PLANS

export function getPlanFromPriceId(priceId: string): PlanKey | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) return key as PlanKey
  }
  return null
}
