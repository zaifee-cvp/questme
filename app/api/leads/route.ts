import { type NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

export async function GET() {
  try {
    const authClient = createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const supabase = createSupabaseServiceClient()
    const { count } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
    return NextResponse.json({ count: count || 0 })
  } catch (err: any) {
    console.error('[GET /api/leads] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServiceClient()
    const { bot_id, session_id, name, email, phone, trigger_message } = await request.json()

    if (!name || (!email && !phone)) {
      return NextResponse.json({ error: 'Name and at least one contact method required' }, { status: 400 })
    }

    const { data: bot } = await supabase
      .from('bots')
      .select('name, handoff_email, user_id')
      .eq('id', bot_id)
      .single()

    if (!bot) return NextResponse.json({ error: 'Bot not found' }, { status: 404 })

    await supabase.from('leads').insert({
      bot_id,
      user_id: bot.user_id,
      session_id,
      name,
      email: email || null,
      phone: phone || null,
      trigger_message: trigger_message || null,
    })

    if (bot.handoff_email) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'noreply@questme.ai',
        to: bot.handoff_email,
        subject: `New Lead from ${bot.name} — ${name}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;background:#080A0E;color:#E2E2F0;">
            <h2 style="color:#AAFF00;margin:0 0 8px;">New Lead Captured</h2>
            <p style="color:#6B7280;margin:0 0 32px;">Someone asked a question your bot couldn't answer on <strong style="color:#E2E2F0">${bot.name}</strong>.</p>
            <div style="background:#0F0F1A;border:1px solid #1A1A2E;border-radius:12px;padding:24px;margin-bottom:24px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#6B7280;font-size:13px;width:120px;">Name</td><td style="padding:8px 0;color:#E2E2F0;font-size:14px;font-weight:600;">${name}</td></tr>
                ${email ? `<tr><td style="padding:8px 0;color:#6B7280;font-size:13px;">Email</td><td style="padding:8px 0;color:#E2E2F0;font-size:14px;"><a href="mailto:${email}" style="color:#AAFF00;">${email}</a></td></tr>` : ''}
                ${phone ? `<tr><td style="padding:8px 0;color:#6B7280;font-size:13px;">Phone</td><td style="padding:8px 0;color:#E2E2F0;font-size:14px;"><a href="tel:${phone}" style="color:#AAFF00;">${phone}</a></td></tr>` : ''}
                ${trigger_message ? `<tr><td style="padding:8px 0;color:#6B7280;font-size:13px;vertical-align:top;">They asked</td><td style="padding:8px 0;color:#E2E2F0;font-size:14px;font-style:italic;">"${trigger_message}"</td></tr>` : ''}
              </table>
            </div>
            <p style="color:#4B5563;font-size:12px;">Captured by Questme.ai · Reply to this lead within 24 hours for best conversion.</p>
          </div>
        `
      }).catch(err => console.error('[leads] Resend error:', err))
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[POST /api/leads] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
