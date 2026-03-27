// lib/email/onboarding.ts
// Uses raw fetch to Resend API — the resend npm package is NOT installed.

const RESEND_API_URL = 'https://api.resend.com/emails'

export async function sendWelcomeEmail({
  email,
  businessName,
  ownerName,
}: {
  email: string
  businessName: string
  ownerName?: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email/onboarding] RESEND_API_KEY not set — skipping welcome email')
    return
  }

  const firstName = ownerName?.split(' ')[0] ?? 'there'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://Dentalys.com'
  const fromDomain = process.env.EMAIL_DOMAIN ?? 'Dentalys.com'

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `Dentalys <hello@${fromDomain}>`,
      to: [email],
      subject: `Welcome to Dentalys, ${firstName}! 🎉`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h1 style="font-size: 24px; margin-bottom: 8px;">Welcome to Dentalys! 🎉</h1>
  <p>Hi ${firstName},</p>
  <p>
    Your business <strong>${businessName}</strong> is all set up on Dentalys —
    the AI-powered booking assistant for clinics and service businesses.
  </p>
  <p><strong>Here's what to do next:</strong></p>
  <ul style="line-height: 1.8;">
    <li>🤖 Connect your Telegram bot for AI-powered bookings</li>
    <li>📅 Add your services and availability</li>
    <li>👥 Import your existing customers (CSV, Excel, VCF)</li>
    <li>📆 Link your Google Calendar for automatic sync</li>
  </ul>
  <p style="margin-top: 24px;">
    <a
      href="${appUrl}/dashboard"
      style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;"
    >Go to your dashboard →</a>
  </p>
  <p style="margin-top: 32px; color: #666; font-size: 14px;">
    Questions? Just reply to this email — we read every one.<br>
    <em>The Dentalys Team</em>
  </p>
</body>
</html>`,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[email/onboarding] Resend error:', err)
    throw new Error(`Failed to send welcome email: ${err}`)
  }
}
