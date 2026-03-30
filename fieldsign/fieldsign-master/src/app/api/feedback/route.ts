import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const { type, message } = await req.json()
    if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })
    await resend.emails.send({
      from: 'FieldSign Feedback <noreply@fieldsign.io>',
      to: ['support@cvidsproductions.net'],
      subject: `[FieldSign Feedback] ${type?.toUpperCase()}: ${message.slice(0, 60)}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <div style="background:#f97316;color:#fff;padding:16px 24px;border-radius:12px 12px 0 0">
            <h2 style="margin:0;font-size:18px">FieldSign User Feedback</h2>
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 12px 12px">
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Message:</strong></p>
            <p style="background:#f8fafc;padding:16px;border-radius:8px;border-left:3px solid #f97316">${message}</p>
          </div>
        </div>
      `,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
