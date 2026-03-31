import { NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

export async function POST() {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const stripe = getStripe()
    const supabase = createSupabaseServiceClient()
    const { data: sub } = await supabase.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).single()
    if (!sub?.stripe_customer_id) return NextResponse.json({ error: 'No billing account found' }, { status: 400 })
    const session = await stripe.billingPortal.sessions.create({ customer: sub.stripe_customer_id, return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing` })
    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[POST /api/stripe/portal] error:', err)
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 })
  }
}
