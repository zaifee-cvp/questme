// app/api/stripe/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getOrCreateStripeCustomer,
  createCheckoutSession,
} from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('business_id')
    .eq('id', user.id)
    .single()

  if (!profile?.business_id) {
    return NextResponse.json({ error: 'No business found' }, { status: 404 })
  }

  try {
    const body = await request.json()
    const plan = body.plan as string

    if (!plan || !['starter', 'pro'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const PRICE_IDS: Record<string, string | undefined> = {
      starter: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || process.env.STRIPE_STARTER_PRICE_ID,
      pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || process.env.STRIPE_PRO_PRICE_ID,
    }

    const priceId = PRICE_IDS[plan as 'starter' | 'pro']

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID not found' }, { status: 400 })
    }

    // Determine remaining trial days — only carry over if still within free trial
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, trial_end')
      .eq('business_id', profile.business_id)
      .single()

    const trialDaysRemaining =
      subscription?.status === 'trialing' && subscription?.trial_end
        ? Math.max(0, Math.ceil((new Date(subscription.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : 0

    const { data: business } = await supabase
      .from('businesses')
      .select('name, email')
      .eq('id', profile.business_id)
      .single()

    const stripeCustomerId = await getOrCreateStripeCustomer(
      profile.business_id,
      user.email || business?.email || '',
      business?.name || ''
    )

    // Save stripe customer ID
    await supabase
      .from('subscriptions')
      .update({ stripe_customer_id: stripeCustomerId })
      .eq('business_id', profile.business_id)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
    const url = await createCheckoutSession({
      stripeCustomerId,
      priceId,
      businessId: profile.business_id,
      trialDays: trialDaysRemaining,
      successUrl: `${appUrl}/dashboard/billing?success=true`,
      cancelUrl: `${appUrl}/dashboard/billing?canceled=true`,
    })

    return NextResponse.json({ url })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Stripe checkout error:', message)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
