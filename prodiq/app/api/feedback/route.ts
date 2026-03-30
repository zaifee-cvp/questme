import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const authClient = createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  const { type, message } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: 'Missing message' }, { status: 400 })

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: 'support@cvidsproductions.net',
      subject: `[Questme.ai Feedback] ${type?.toUpperCase()} — from ${user?.email || 'anonymous'}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
          <h2 style="color:#080A0E;">New ${type} feedback</h2>
          <p><strong>From:</strong> ${user?.email || 'Anonymous'}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left:3px solid #AAFF00;padding-left:16px;color:#333;">${message}</blockquote>
          <p style="color:#888;font-size:12px;">Sent from Questme.ai dashboard</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Feedback email error:', err)
  }

  return NextResponse.json({ success: true })
}
