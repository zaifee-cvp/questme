import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { getStripe, getPlanFromPriceId, PLAN_LIMITS } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const stripe = getStripe()
  const supabase = createSupabaseServiceClient()
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  let event
  try { event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!) }
  catch (err: any) { return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 }) }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any
      const userId = session.metadata?.user_id
      if (!userId) break
      const subscription = await stripe.subscriptions.retrieve(session.subscription) as any
      const priceId = subscription.items.data[0]?.price.id
      const plan = getPlanFromPriceId(priceId)
      const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]
      await supabase.from('subscriptions').upsert({ user_id: userId, stripe_customer_id: session.customer, stripe_subscription_id: session.subscription, plan, status: 'active', current_period_end: new Date(subscription.current_period_end * 1000).toISOString(), ...limits, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      break
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as any
      const { data: sub } = await supabase.from('subscriptions').select('user_id').eq('stripe_subscription_id', subscription.id).single()
      if (!sub) break
      const priceId = subscription.items.data[0]?.price.id
      const plan = getPlanFromPriceId(priceId)
      const limits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]
      await supabase.from('subscriptions').update({ plan, status: subscription.status, current_period_end: new Date(subscription.current_period_end * 1000).toISOString(), ...limits, updated_at: new Date().toISOString() }).eq('user_id', sub.user_id)
      break
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any
      await supabase.from('subscriptions').update({ plan: 'free', status: 'canceled', stripe_subscription_id: null, ...PLAN_LIMITS.free, updated_at: new Date().toISOString() }).eq('stripe_subscription_id', subscription.id)
      break
    }
  }
  return NextResponse.json({ received: true })
}
