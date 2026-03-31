import { NextRequest, NextResponse } from 'next/server'

interface EmailData {
  token: string
  token_hash: string
  redirect_to: string
  email_action_type: 'signup' | 'recovery' | 'magiclink' | string
}

interface HookPayload {
  user: { email: string; [key: string]: unknown }
  email_data: EmailData
}

function buildConfirmLink(email_data: EmailData): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  return `${siteUrl}/auth/confirm?token_hash=${email_data.token_hash}&type=${email_data.email_action_type}&next=/dashboard`
}

function emailTemplate(title: string, heading: string, body: string, ctaHref: string, ctaLabel: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#080A0E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080A0E;min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="100%" style="max-width:560px;background:#0F1117;border-radius:12px;border:1px solid #1E2028;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #1E2028;">
              <span style="font-size:22px;font-weight:700;color:#AAFF00;letter-spacing:-0.5px;">Questme.ai</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#F0F0F0;line-height:1.3;">${heading}</h1>
              <p style="margin:0 0 32px;font-size:15px;color:#9CA3AF;line-height:1.7;">${body}</p>
              <a href="${ctaHref}"
                 style="display:inline-block;padding:14px 28px;background:#AAFF00;color:#080A0E;font-size:15px;font-weight:700;border-radius:8px;text-decoration:none;letter-spacing:-0.2px;">
                ${ctaLabel}
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #1E2028;">
              <p style="margin:0;font-size:12px;color:#4B5563;line-height:1.6;">
                If you didn't request this email you can safely ignore it.<br />
                This link expires in 24 hours.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function POST(request: NextRequest) {
  const payload: HookPayload = await request.json()
  const { user, email_data } = payload
  const confirmLink = buildConfirmLink(email_data)

  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  let subject: string
  let html: string

  switch (email_data.email_action_type) {
    case 'signup':
      subject = 'Confirm your Questme.ai account'
      html = emailTemplate(
        subject,
        'Confirm your account',
        'Thanks for signing up! Click the button below to verify your email address and activate your Questme.ai account.',
        confirmLink,
        'Confirm account'
      )
      break

    case 'recovery':
      subject = 'Reset your Questme.ai password'
      html = emailTemplate(
        subject,
        'Reset your password',
        'We received a request to reset the password for your Questme.ai account. Click the button below to choose a new password.',
        confirmLink,
        'Reset password'
      )
      break

    case 'magiclink':
      subject = 'Your Questme.ai login link'
      html = emailTemplate(
        subject,
        'Your magic link',
        'Here is your one-click login link for Questme.ai. This link is valid for 24 hours and can only be used once.',
        confirmLink,
        'Sign in to Questme.ai'
      )
      break

    default:
      subject = 'Action required — Questme.ai'
      html = emailTemplate(
        subject,
        'Action required',
        'Click the button below to continue.',
        confirmLink,
        'Continue'
      )
  }

  const { error } = await resend.emails.send({
    from: 'Questme.ai <noreply@questme.ai>',
    to: user.email,
    subject,
    html,
  })

  if (error) {
    console.error('[send-email hook] Resend error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({}, { status: 200 })
}
