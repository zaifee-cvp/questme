'use client'
import { useState } from 'react'

const sections = [
  {
    icon: '🚀',
    title: 'Getting Started',
    content: [
      'After signing up, create your first company profile under Settings → Company Profile.',
      'Add your company logo, name, address, and contact details — these appear on every PDF report.',
      'Set your default currency and timezone for accurate reporting.',
    ],
  },
  {
    icon: '📋',
    title: 'Creating Work Orders (SWOs)',
    content: [
      'Go to Work Orders → New SWO to create a new service work order.',
      'Fill in the client name, contact details, service type, scheduled date, and assign a technician.',
      'Each SWO gets a unique sequential number (e.g. SWO-000001) automatically.',
      'You can attach internal notes that are visible to technicians but not included in the client PDF.',
    ],
  },
  {
    icon: '📱',
    title: 'QR Code Access for Technicians',
    content: [
      'Every technician gets a unique QR code. Go to Technicians → select a technician → Print QR.',
      'Technicians scan the QR code with any phone camera — no app installation required.',
      'The QR opens their personalised job dashboard showing all assigned SWOs.',
      'Print QR codes once and reuse them indefinitely — they never expire.',
    ],
  },
  {
    icon: '✍️',
    title: 'Completing Reports & Signatures',
    content: [
      'On-site, the technician selects the SWO, fills in the service report form.',
      'Service details, time taken, materials used, and findings are captured digitally.',
      'The technician presents the phone to the client for their signature on-screen.',
      'Once signed, the report is locked and a PDF is generated and emailed automatically.',
    ],
  },
  {
    icon: '📄',
    title: 'PDF Reports',
    content: [
      'PDF reports are branded with your company logo and details.',
      'They include: SWO number, client info, service summary, technician name, signature, timestamp.',
      'Reports are emailed automatically to the client and your company inbox upon completion.',
      'You can also resend any report from the Reports dashboard with one click.',
      'All reports are stored permanently and searchable by SWO number, client name, or date.',
    ],
  },
  {
    icon: '👥',
    title: 'Managing Clients & Technicians',
    content: [
      'Add clients under the Clients section. Store name, email, phone, and address.',
      'Clients are auto-populated when creating SWOs — no re-entering details each time.',
      'Add technicians under the Technicians section. Each gets a unique login QR code.',
      'You can activate or deactivate technicians without deleting their historical reports.',
    ],
  },
  {
    icon: '💳',
    title: 'Billing & Subscription',
    content: [
      'Manage your subscription under Settings → Billing.',
      'Upgrade or downgrade your plan at any time — changes take effect immediately.',
      'All plans include a 14-day free trial with full access to all features.',
      'Invoices are emailed automatically on each billing cycle.',
    ],
  },
]

export default function HelpPage() {
  const [openSection, setOpenSection] = useState<number | null>(0)

  function generateManualHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FieldSign.io — User Manual</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e293b; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; }
  .header { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; padding: 40px; border-radius: 16px; margin-bottom: 40px; }
  .header h1 { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
  .header p { font-size: 15px; opacity: 0.85; }
  .header .meta { margin-top: 20px; font-size: 13px; opacity: 0.7; }
  .section { margin-bottom: 32px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
  .section-header { background: #fff7ed; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 12px; }
  .section-header h2 { font-size: 17px; font-weight: 700; color: #1e293b; }
  .section-body { padding: 20px; }
  .section-body li { padding: 6px 0 6px 20px; font-size: 14px; color: #374151; line-height: 1.6; position: relative; list-style: none; }
  .section-body li::before { content: '→'; position: absolute; left: 0; color: #f97316; font-weight: 700; }
  .footer { margin-top: 48px; padding-top: 24px; border-top: 2px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 13px; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<div class="header">
  <h1>FieldSign.io</h1>
  <p>Field Service Management Platform — User Manual</p>
  <div class="meta">Version 1.0 &nbsp;·&nbsp; Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} &nbsp;·&nbsp; fieldsign.io</div>
</div>
${sections.map(s => `
<div class="section">
  <div class="section-header">
    <span style="font-size:22px">${s.icon}</span>
    <h2>${s.title}</h2>
  </div>
  <div class="section-body">
    <ul>${s.content.map(c => `<li>${c}</li>`).join('')}</ul>
  </div>
</div>`).join('')}
<div class="footer">
  <p><strong>FieldSign.io</strong> — Field Service Management Platform</p>
  <p style="margin-top:6px">Need help? Email us at <strong>support@fieldsign.io</strong></p>
  <p style="margin-top:4px">© ${new Date().getFullYear()} FieldSign. All rights reserved.</p>
</div>
</body>
</html>`
  }

  function downloadManual() {
    const html = generateManualHTML()
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'FieldSign-User-Manual.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>Help & User Manual</h1>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Everything you need to get the most out of FieldSign.io</p>
          </div>
          <button
            onClick={downloadManual}
            style={{
              background: '#f97316', color: '#fff', border: 'none', borderRadius: '10px',
              padding: '12px 20px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
            }}
          >
            📥 Download User Manual
          </button>
        </div>

        {/* Quick contact */}
        <div style={{ marginTop: '20px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '22px' }}>💬</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>Need personal support?</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Email us at <a href="mailto:support@fieldsign.io" style={{ color: '#f97316', fontWeight: 600 }}>support@fieldsign.io</a> — we reply within 24 hours.
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sections.map((section, i) => (
          <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
            <button
              onClick={() => setOpenSection(openSection === i ? null : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', background: openSection === i ? '#fff7ed' : '#fff',
                border: 'none', cursor: 'pointer', textAlign: 'left', gap: '12px',
                borderBottom: openSection === i ? '1px solid #fed7aa' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '22px' }}>{section.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#1e293b' }}>{section.title}</span>
              </div>
              <span style={{ color: '#f97316', fontSize: '18px', fontWeight: 700, transition: 'transform 0.2s', transform: openSection === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            {openSection === i && (
              <div style={{ padding: '16px 20px 20px', background: '#fffbf7' }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {section.content.map((item, j) => (
                    <li key={j} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>
                      <span style={{ color: '#f97316', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
        FieldSign.io v1.0 · support@fieldsign.io
      </div>
    </div>
  )
}
