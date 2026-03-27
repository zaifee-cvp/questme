// lib/stripe/index.ts
import Stripe from 'stripe'
import type { PlanKey } from '@/types'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
})

export async function getOrCreateStripeCustomer(
  businessId: string,
  email: string,
  name: string
): Promise<string> {
  const existing = await stripe.customers.list({ email, limit: 1 })

  if (existing.data.length > 0) {
    return existing.data[0].id
  }

  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { businessId },
  })

  return customer.id
}

export async function createCheckoutSession({
  stripeCustomerId,
  priceId,
  businessId,
  trialDays,
  successUrl,
  cancelUrl,
}: {
  stripeCustomerId: string
  priceId: string
  businessId: string
  trialDays: number
  successUrl: string
  cancelUrl: string
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      ...(trialDays > 0 ? { trial_period_days: trialDays } : {}),
      metadata: { businessId },
    },
    allow_promotion_codes: true,
  })

  return session.url!
}

export async function createPortalSession(
  stripeCustomerId: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  })

  return session.url
}

export function getPlanFromPriceId(priceId: string): PlanKey | null {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID) {
    return 'starter'
  }
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
    return 'pro'
  }
  return null
}
