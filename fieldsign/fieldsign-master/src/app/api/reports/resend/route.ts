import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceClient } from '@/lib/supabase/server'
import { renderPdfToBuffer } from '@/lib/pdf/generator'
import { sendReportEmail } from '@/lib/email/resend'

// POST /api/reports/resend
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles').select('company_id, role').eq('id', user.id).single()
    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { work_order_id } = await request.json()
    if (!work_order_id) return NextResponse.json({ success: false, error: 'work_order_id required' }, { status: 400 })

    const serviceClient = createServiceClient()

    // Load work order with all related data
    const { data: workOrder } = await serviceClient
      .from('work_orders')
      .select('*, swo:swos(swo_no), service:services(service_name)')
      .eq('id', work_order_id)
      .eq('company_id', profile.company_id)
      .single()

    if (!workOrder) return NextResponse.json({ success: false, error: 'Work order not found' }, { status: 404 })

    const { data: company } = await serviceClient
      .from('companies').select('*').eq('id', profile.company_id).single()
    if (!company) return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 })

    const { data: fieldValues } = await serviceClient
      .from('work_order_field_values')
      .select('*')
      .eq('work_order_id', work_order_id)

    // Regenerate PDF
    const pdfBuffer = await renderPdfToBuffer(
      company,
      workOrder as any,
      fieldValues ?? [],
      workOrder.signature_url ?? undefined
    )

    const now = new Date().toISOString()

    // Resend to client
    if (workOrder.client_email) {
      const result = await sendReportEmail({
        company,
        workOrder: workOrder as any,
        recipientEmail: workOrder.client_email,
        recipientType: 'client',
        pdfBuffer,
      })
      await serviceClient.from('email_logs').insert({
        company_id: profile.company_id,
        work_order_id,
        recipient_email: workOrder.client_email,
        recipient_type: 'client',
        subject: `Service Report ${workOrder.service_report_no} (Resent)`,
        status: result.success ? 'sent' : 'failed',
        provider_message_id: result.messageId ?? null,
        error_message: result.error ?? null,
        sent_at: result.success ? now : null,
      })
    }

    // Resend to company
    const companyResult = await sendReportEmail({
      company,
      workOrder: workOrder as any,
      recipientEmail: company.company_email,
      recipientType: 'company',
      pdfBuffer,
    })
    await serviceClient.from('email_logs').insert({
      company_id: profile.company_id,
      work_order_id,
      recipient_email: company.company_email,
      recipient_type: 'company',
      subject: `Service Report ${workOrder.service_report_no} (Resent)`,
      status: companyResult.success ? 'sent' : 'failed',
      provider_message_id: companyResult.messageId ?? null,
      error_message: companyResult.error ?? null,
      sent_at: companyResult.success ? now : null,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
