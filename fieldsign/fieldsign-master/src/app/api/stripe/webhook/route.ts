import { NextResponse } from 'next/server'
import { stripe, getPlanFromPriceId } from '@/lib/stripe/server'
import { createServiceClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

// Disable body parsing — Stripe needs raw body for signature verification
export const runtime = 'nodejs'

async function updateCompanySubscription(
  db: ReturnType<typeof createServiceClient>,
  companyId: string,
  updates: {
    stripe_subscription_id?: string
    subscription_status?: string
    subscription_plan?: string | null
    trial_ends_at?: string | null
    current_period_end?: string | null
  }
) {
  const { error } = await db
    .from('companies')
    .update(updates)
    .eq('id', companyId)

  if (error) console.error('[webhook] DB update error:', error)
}

async function getCompanyIdByCustomer(
  db: ReturnType<typeof createServiceClient>,
  customerId: string
): Promise<string | null> {
  const { data } = await db
    .from('companies')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()
  return data?.id ?? null
}

async function getCompanyIdBySubscription(
  db: ReturnType<typeof createServiceClient>,
  subscriptionId: string
): Promise<string | null> {
  const { data } = await db
    .from('companies')
    .select('id')
    .eq('stripe_subscription_id', subscriptionId)
    .single()
  return data?.id ?? null
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('[webhook] Signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const db = createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== 'subscription') break

        const companyId = session.metadata?.company_id
        const plan = session.metadata?.plan
        if (!companyId) break

        const subscriptionId = session.subscription as string
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)

        await updateCompanySubscription(db, companyId, {
          stripe_subscription_id: subscriptionId,
          subscription_status: subscription.status,
          subscription_plan: plan ?? null,
          trial_ends_at: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null,
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        })
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        let companyId = await getCompanyIdBySubscription(db, subscription.id)
        if (!companyId) companyId = await getCompanyIdByCustomer(db, customerId)
        if (!companyId) break

        const priceId = subscription.items.data[0]?.price.id
        const plan = priceId ? getPlanFromPriceId(priceId) : null

        await updateCompanySubscription(db, companyId, {
          stripe_subscription_id: subscription.id,
          subscription_status: subscription.status,
          subscription_plan: plan ?? undefined,
          trial_ends_at: subscription.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null,
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const companyId = await getCompanyIdBySubscription(db, subscription.id)
        if (!companyId) break

        await updateCompanySubscription(db, companyId, {
          subscription_status: 'canceled',
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription as string | null
        if (!subscriptionId) break

        const companyId = await getCompanyIdBySubscription(db, subscriptionId)
        if (!companyId) break

        await updateCompanySubscription(db, companyId, {
          subscription_status: 'past_due',
        })
        break
      }

      default:
        // Unhandled event type — ignore
        break
    }
  } catch (err: any) {
    console.error(`[webhook] Error handling ${event.type}:`, err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
