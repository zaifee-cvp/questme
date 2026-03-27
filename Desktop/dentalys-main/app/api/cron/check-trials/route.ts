import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const resend = new Resend(process.env.RESEND_API_KEY)

  // Find expired trials with no Stripe subscription
  const { data: expired } = await supabase
    .from('subscriptions')
    .select('business_id, trial_end, businesses(name, slug, profiles(email, full_name))')
    .eq('status', 'trialing')
    .is('stripe_subscription_id', null)
    .lt('trial_end', new Date().toISOString())

  if (!expired?.length) return NextResponse.json({ processed: 0 })

  let processed = 0
  for (const sub of expired) {
    // Mark as canceled
    await supabase
      .from('subscriptions')
      .update({ status: 'canceled', plan: 'free' })
      .eq('business_id', sub.business_id)

    // Send expiry email
    const business = sub.businesses as any
    const profile = business?.profiles as any
    const email = profile?.email
    const name = profile?.full_name || 'there'
    const clinicName = business?.name || 'Your clinic'

    if (email) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: email,
        subject: `Your Dentalys.ai trial has ended — upgrade to continue`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your free trial has ended, ${name}</h2>
            <p>Your 14-day free trial for <strong>${clinicName}</strong> on Dentalys.ai has expired.</p>
            <p>Your AI dental receptionist has been paused. Upgrade now to resume service and never miss a patient booking.</p>
            <a href="https://dentalys.ai/dashboard/billing" style="display:inline-block;background:#0b7b6b;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
              Upgrade Now →
            </a>
            <p style="margin-top:24px;color:#666;font-size:14px;">
              Questions? Reply to this email and we'll help you get set up.
            </p>
          </div>
        `,
      })
    }
    processed++
  }

  return NextResponse.json({ processed })
}
