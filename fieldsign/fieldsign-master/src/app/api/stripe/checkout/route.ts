import { NextResponse } from 'next/server'
import { stripe, PLANS, getPlanFromPriceId } from '@/lib/stripe/server'
import { getServerUser, createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const user = await getServerUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { priceId } = await req.json()
    if (!priceId) return NextResponse.json({ error: 'priceId is required' }, { status: 400 })

    // Validate priceId is one of our plans
    const plan = getPlanFromPriceId(priceId)
    if (!plan) return NextResponse.json({ error: 'Invalid price ID' }, { status: 400 })

    const db = createServiceClient()

    // Get company via profile
    const { data: profile } = await db
      .from('profiles')
      .select('company_id, companies(id, company_name, company_email, stripe_customer_id)')
      .eq('id', user.id)
      .single()

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const company = (profile as any).companies
    if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 })

    let customerId: string = company.stripe_customer_id

    // Create Stripe customer if not exists
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: company.company_email ?? user.email,
        name: company.company_name,
        metadata: { company_id: company.id },
      })
      customerId = customer.id

      await db
        .from('companies')
        .update({ stripe_customer_id: customerId })
        .eq('id', company.id)
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata: { company_id: company.id, plan },
      },
      success_url: `${appUrl}/dashboard/billing?success=true`,
      cancel_url: `${appUrl}/dashboard/billing?canceled=true`,
      metadata: { company_id: company.id, plan },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[stripe/checkout]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
