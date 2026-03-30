import { Resend } from 'resend'
import type { Company, WorkOrder } from '@/types'
import { formatDate, formatTime, interpolateEmailTemplate } from '@/lib/utils/formatters'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'noreply@example.com'
const FROM_NAME = process.env.RESEND_FROM_NAME ?? 'FieldService Platform'

interface SendReportEmailOptions {
  company: Company
  workOrder: WorkOrder
  recipientEmail: string
  recipientType: 'client' | 'company'
  pdfBuffer: Buffer
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

// ============================================================
// SEND REPORT EMAIL
// ============================================================
export async function sendReportEmail({
  company,
  workOrder,
  recipientEmail,
  recipientType,
  pdfBuffer,
}: SendReportEmailOptions): Promise<EmailResult> {
  try {
    const templateVars = {
      report_no: workOrder.service_report_no,
      swo_no: workOrder.swo?.swo_no ?? '',
      client_name: workOrder.client_name,
      technician_name: workOrder.technician_name,
      service_date: workOrder.service_date ? formatDate(workOrder.service_date) : '',
      start_time: workOrder.start_time ? formatTime(workOrder.start_time) : '',
      end_time: workOrder.end_time ? formatTime(workOrder.end_time) : '',
      company_name: company.company_name,
      company_email: company.company_email,
      company_phone: company.company_phone ?? '',
    }

    const subject = interpolateEmailTemplate(
      company.email_template_subject ?? 'Service Completion Report - {{report_no}}',
      templateVars
    )

    const bodyText = interpolateEmailTemplate(
      company.email_template_body ??
        `Dear {{client_name}},\n\nPlease find attached your service completion report {{report_no}}.\n\nThank you for your business.\n\n{{company_name}}`,
      templateVars
    )

    // Build HTML version
    const htmlBody = buildEmailHtml(bodyText, company, workOrder)

    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [recipientEmail],
      subject,
      html: htmlBody,
      text: bodyText,
      attachments: [
        {
          filename: `ServiceReport_${workOrder.service_report_no}.pdf`,
          content: pdfBuffer,
        },
      ],
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error'
    return { success: false, error: message }
  }
}

// ============================================================
// HTML EMAIL BUILDER
// ============================================================
function buildEmailHtml(bodyText: string, company: Company, workOrder: WorkOrder): string {
  const lines = bodyText.split('\n').map(line => `<p>${line}</p>`).join('\n')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #f4f4f4; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #1e3a5f; padding: 24px 32px; }
    .header-title { color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; }
    .header-sub { color: #9cb3cc; font-size: 13px; margin: 4px 0 0 0; }
    .body { padding: 32px; }
    .body p { color: #333333; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0; }
    .report-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0; }
    .report-box table { width: 100%; border-collapse: collapse; }
    .report-box td { padding: 6px 8px; font-size: 13px; }
    .report-box td:first-child { color: #666666; font-weight: 600; width: 40%; }
    .report-box td:last-child { color: #222222; }
    .footer { background: #f8f8f8; padding: 16px 32px; border-top: 1px solid #eeeeee; }
    .footer p { color: #999999; font-size: 11px; margin: 0; }
    .badge { display: inline-block; background: #e05a2b; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <p class="header-title">${company.company_name}</p>
      <p class="header-sub">Service Completion Report</p>
    </div>
    <div class="body">
      ${lines}
      <div class="report-box">
        <table>
          <tr>
            <td>Report Number</td>
            <td><span class="badge">${workOrder.service_report_no}</span></td>
          </tr>
          ${workOrder.swo?.swo_no ? `<tr><td>SWO Number</td><td>${workOrder.swo.swo_no}</td></tr>` : ''}
          <tr>
            <td>Client</td>
            <td>${workOrder.client_name}</td>
          </tr>
          <tr>
            <td>Service Date</td>
            <td>${workOrder.service_date ? formatDate(workOrder.service_date) : ''}</td>
          </tr>
          <tr>
            <td>Technician</td>
            <td>${workOrder.technician_name}</td>
          </tr>
        </table>
      </div>
      <p style="font-size:13px;color:#666;">The service completion report has been attached as a PDF to this email.</p>
    </div>
    <div class="footer">
      <p>${company.pdf_footer ?? `Thank you for choosing ${company.company_name}.`}</p>
      <p style="margin-top:4px;">© ${new Date().getFullYear()} ${company.company_name}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
