// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe, getPlanFromPriceId } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Stripe webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const db = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.subscription && session.customer) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )
          const businessId =
            subscription.metadata.businessId ||
            session.metadata?.businessId

          if (!businessId) {
            console.log('No businessId in metadata, skipping event')
            break
          }

          // Validate businessId exists in DB to prevent metadata spoofing
          const { data: biz } = await db
            .from('businesses')
            .select('id')
            .eq('id', businessId)
            .maybeSingle()
          if (!biz) {
            console.log('businessId not found in DB, skipping event:', businessId)
            break
          }

          const priceId = subscription.items.data[0]?.price.id
            const plan = getPlanFromPriceId(priceId) || 'starter'

            await db.from('subscriptions').upsert(
              {
                business_id: businessId,
                stripe_customer_id: session.customer as string,
                stripe_subscription_id: subscription.id,
                stripe_price_id: priceId,
                plan,
                status: subscription.status === 'trialing' ? 'trialing' : 'active',
                current_period_start: new Date(
                  subscription.current_period_start * 1000
                ).toISOString(),
                current_period_end: new Date(
                  subscription.current_period_end * 1000
                ).toISOString(),
                trial_end: subscription.trial_end
                  ? new Date(subscription.trial_end * 1000).toISOString()
                  : null,
              } as any,
              { onConflict: 'business_id' }
            )
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const businessId = subscription.metadata.businessId

        if (businessId) {
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId) || 'starter'

          let status = subscription.status as 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete'
          if (!['trialing', 'active', 'past_due', 'canceled', 'incomplete'].includes(status)) {
            status = 'incomplete'
          }

          await db
            .from('subscriptions')
            .update({
              stripe_price_id: priceId,
              plan,
              status,
              current_period_start: new Date(
                subscription.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              trial_end: subscription.trial_end
                ? new Date(subscription.trial_end * 1000).toISOString()
                : null,
            })
            .eq('stripe_subscription_id', subscription.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await db
          .from('subscriptions')
          .update({ status: 'canceled', plan: 'free' })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          await db
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription as string)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Stripe webhook handler error:', err)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
