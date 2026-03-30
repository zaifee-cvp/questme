import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { getServerUser, createServiceClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const user = await getServerUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const db = createServiceClient()

    const { data: profile } = await db
      .from('profiles')
      .select('company_id, companies(stripe_customer_id)')
      .eq('id', user.id)
      .single()

    const company = (profile as any)?.companies
    if (!company?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found. Please start a subscription first.' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'

    const session = await stripe.billingPortal.sessions.create({
      customer: company.stripe_customer_id,
      return_url: `${appUrl}/dashboard/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[stripe/portal]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
