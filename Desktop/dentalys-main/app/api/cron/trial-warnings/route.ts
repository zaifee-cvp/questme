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

  const now = new Date()
  const in2days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)

  // Find trials expiring in next 2 days, warning not yet sent
  const { data: expiring } = await supabase
    .from('subscriptions')
    .select('business_id, trial_end, businesses(name, slug, profiles(email, full_name))')
    .eq('status', 'trialing')
    .is('stripe_subscription_id', null)
    .is('trial_warning_sent', null)
    .lt('trial_end', in2days.toISOString())
    .gt('trial_end', now.toISOString())

  if (!expiring?.length) return NextResponse.json({ processed: 0 })

  let processed = 0
  for (const sub of expiring) {
    const business = sub.businesses as any
    const profile = business?.profiles as any
    const email = profile?.email
    const name = profile?.full_name || 'there'
    const clinicName = business?.name || 'Your clinic'
    const trialEnd = new Date(sub.trial_end).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    if (email) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: email,
        subject: `Your Dentalys.ai trial expires in 2 days`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your trial ends on ${trialEnd}</h2>
            <p>Hi ${name}, your free trial for <strong>${clinicName}</strong> expires in 2 days.</p>
            <p>Upgrade now to keep your AI dental receptionist running 24/7 — never miss a patient booking.</p>
            <a href="https://dentalys.ai/dashboard/billing" style="display:inline-block;background:#0b7b6b;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
              Upgrade Now →
            </a>
            <h3>What you get with Dentalys Pro:</h3>
            <ul>
              <li>✅ Unlimited patient conversations</li>
              <li>✅ 24/7 AI dental receptionist on Telegram</li>
              <li>✅ Appointment booking + reminders</li>
              <li>✅ Google Calendar sync</li>
              <li>✅ Multi-language support</li>
            </ul>
            <p style="color:#666;font-size:14px;">
              Questions? Reply to this email anytime.
            </p>
          </div>
        `,
      })

      await supabase
        .from('subscriptions')
        .update({ trial_warning_sent: now.toISOString() })
        .eq('business_id', sub.business_id)
    }
    processed++
  }

  return NextResponse.json({ processed })
}
