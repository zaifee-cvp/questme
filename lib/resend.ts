export async function sendHandoffEmail(opts: {
  to: string; botName: string; visitorEmail?: string; visitorName?: string; message: string
}) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'noreply@questme.ai',
    to: opts.to,
    subject: `[${opts.botName}] Customer needs human assistance`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
        <h2>Customer needs your help</h2>
        <p>A visitor on your <strong>${opts.botName}</strong> bot requested a human agent.</p>
        ${opts.visitorEmail ? `<p><strong>Email:</strong> ${opts.visitorEmail}</p>` : ''}
        ${opts.visitorName ? `<p><strong>Name:</strong> ${opts.visitorName}</p>` : ''}
        <p><strong>Their message:</strong></p>
        <blockquote style="border-left:3px solid #AAFF00;padding-left:16px;color:#555;">${opts.message}</blockquote>
        <p style="color:#888;font-size:12px;">Sent by Questme.ai</p>
      </div>
    `,
  })
}

export async function sendWeeklyDigest(opts: {
  to: string; botName: string; totalChats: number; answerRate: number; topUnanswered: string[]; leadsThisWeek: number
}) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'noreply@questme.ai',
    to: opts.to,
    subject: `[${opts.botName}] Your weekly AI report`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
        <h2>${opts.botName} — Weekly Report</h2>
        <table style="width:100%;margin:20px 0;">
          <tr>
            <td style="text-align:center;padding:16px;"><div style="font-size:32px;font-weight:700;">${opts.totalChats}</div><div style="color:#888;">Total chats</div></td>
            <td style="text-align:center;padding:16px;"><div style="font-size:32px;font-weight:700;color:#AAFF00;">${opts.answerRate}%</div><div style="color:#888;">Answer rate</div></td>
            <td style="text-align:center;padding:16px;"><div style="font-size:32px;font-weight:700;">${opts.leadsThisWeek}</div><div style="color:#888;">New leads</div></td>
          </tr>
        </table>
        ${opts.topUnanswered.length > 0 ? `
          <h3>Knowledge gaps this week:</h3>
          <ul>${opts.topUnanswered.map(q => `<li>${q}</li>`).join('')}</ul>
          <p style="color:#888;">Add these to your knowledge base to improve your answer rate.</p>
        ` : '<p style="color:#22c55e;">No knowledge gaps this week!</p>'}
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:#AAFF00;color:#080A0E;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px;">View Dashboard</a>
        <p style="color:#aaa;font-size:12px;margin-top:24px;">Sent by Questme.ai</p>
      </div>
    `,
  })
}
