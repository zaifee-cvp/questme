import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { renderPdfToBuffer } from '@/lib/pdf/generator'
import { sendReportEmail } from '@/lib/email/resend'
import { calculateDurationMinutes } from '@/lib/utils/formatters'
import { checkLimit } from '@/lib/billing/limits'

export const maxDuration = 60 // seconds - needed for PDF generation

// POST /api/reports/submit
export async function POST(request: NextRequest) {
  let workOrderId: string | null = null

  try {
    const body = await request.json()

    const {
      swo_id, company_id, technician_id, technician_name,
      client_id, client_name, contact_number, client_email, service_address,
      service_id, service_date, start_time, end_time, work_summary,
      field_values, report_started_at,
      extension_requested, extension_reason, extension_minutes,
      signature_data, is_new_client,
    } = body

    // Validate required fields
    if (!company_id || !technician_id || !client_name || !contact_number || !client_email || !service_id) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Check monthly report limit before proceeding
    const reportLimit = await checkLimit(company_id, 'reports')
    if (!reportLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Monthly report limit reached. Your ${reportLimit.plan} plan allows ${reportLimit.limit} reports per month. Upgrade to submit more reports.`,
          limit: reportLimit.limit,
          current: reportLimit.current,
          plan: reportLimit.plan,
          upgrade_url: '/dashboard/billing',
        },
        { status: 409 }
      )
    }

    const serviceClient = createServiceClient()
    const now = new Date().toISOString()

    // --------------------------------------------------------
    // STEP 1: Verify company and technician exist and are active
    // --------------------------------------------------------
    const { data: company } = await serviceClient
      .from('companies').select('*').eq('id', company_id).single()
    if (!company) return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 })

    const { data: technician } = await serviceClient
      .from('technicians').select('*').eq('id', technician_id).eq('company_id', company_id).eq('status', 'active').single()
    if (!technician) return NextResponse.json({ success: false, error: 'Technician not found or inactive' }, { status: 404 })

    const { data: service } = await serviceClient
      .from('services').select('*').eq('id', service_id).eq('company_id', company_id).single()
    if (!service) return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 })

    // --------------------------------------------------------
    // STEP 2: Create or update client record
    // --------------------------------------------------------
    let resolvedClientId = client_id

    if (!resolvedClientId || is_new_client) {
      // Check if client exists by name + contact (to avoid duplicates)
      const { data: existingClient } = await serviceClient
        .from('clients')
        .select('id')
        .eq('company_id', company_id)
        .ilike('client_name', client_name.trim())
        .maybeSingle()

      if (existingClient) {
        resolvedClientId = existingClient.id
        // Update contact info
        await serviceClient.from('clients').update({
          contact_number: contact_number || null,
          email: client_email || null,
          address: service_address || null,
        }).eq('id', resolvedClientId)
      } else {
        const { data: newClient } = await serviceClient
          .from('clients')
          .insert({
            company_id,
            client_name: client_name.trim(),
            contact_number: contact_number || null,
            email: client_email || null,
            address: service_address || null,
          })
          .select()
          .single()
        resolvedClientId = newClient?.id
      }
    }

    // --------------------------------------------------------
    // STEP 3: Create or update SWO if technician-created
    // --------------------------------------------------------
    let resolvedSwoId = swo_id

    if (!resolvedSwoId) {
      // Technician-created SWO
      const { data: swoNoResult } = await serviceClient
        .rpc('generate_swo_number', { p_company_id: company_id })

      const { data: newSwo } = await serviceClient
        .from('swos')
        .insert({
          company_id,
          swo_no: swoNoResult,
          client_id: resolvedClientId,
          service_id,
          technician_id,
          source_type: 'technician',
          service_address: service_address || null,
          status: 'In Progress',
        })
        .select()
        .single()
      resolvedSwoId = newSwo?.id
    } else {
      // Update existing SWO status
      await serviceClient.from('swos')
        .update({ status: 'In Progress' })
        .eq('id', resolvedSwoId)
    }

    // --------------------------------------------------------
    // STEP 4: Generate service report number (race-condition safe)
    // --------------------------------------------------------
    const { data: reportNoResult, error: reportNoError } = await serviceClient
      .rpc('generate_report_number', { p_company_id: company_id })

    if (reportNoError || !reportNoResult) {
      return NextResponse.json({ success: false, error: 'Failed to generate report number' }, { status: 500 })
    }

    const serviceReportNo: string = reportNoResult
    const durationMinutes = calculateDurationMinutes(start_time, end_time)

    // --------------------------------------------------------
    // STEP 5: Create work order record
    // --------------------------------------------------------
    const { data: workOrder, error: woError } = await serviceClient
      .from('work_orders')
      .insert({
        company_id,
        swo_id: resolvedSwoId,
        service_report_no: serviceReportNo,
        client_id: resolvedClientId,
        technician_id,
        service_id,
        client_name: client_name.trim(),
        contact_number: contact_number || null,
        client_email: client_email || null,
        service_address: service_address || null,
        technician_name,
        service_date,
        start_time,
        end_time,
        duration_minutes: durationMinutes,
        work_summary: work_summary || null,
        report_started_at,
        report_submitted_at: now,
        extension_requested: Boolean(extension_requested),
        extension_reason: extension_reason || null,
        extension_minutes: extension_minutes || null,
        status: 'Completed',
      })
      .select()
      .single()

    if (woError || !workOrder) {
      return NextResponse.json({ success: false, error: 'Failed to create work order' }, { status: 500 })
    }

    workOrderId = workOrder.id

    // --------------------------------------------------------
    // STEP 6: Save dynamic field values
    // --------------------------------------------------------
    if (field_values && Object.keys(field_values).length > 0) {
      const { data: serviceFieldDefs } = await serviceClient
        .from('service_fields')
        .select('*')
        .eq('service_id', service_id)

      const fieldValueInserts = Object.entries(field_values as Record<string, string>).map(([key, value]) => {
        const fieldDef = serviceFieldDefs?.find(f => f.field_key === key)
        return {
          work_order_id: workOrderId!,
          service_field_id: fieldDef?.id ?? null,
          field_label: fieldDef?.field_label ?? key,
          field_key: key,
          value_text: String(value),
        }
      })

      if (fieldValueInserts.length > 0) {
        await serviceClient.from('work_order_field_values').insert(fieldValueInserts)
      }
    }

    // --------------------------------------------------------
    // STEP 7: Save signature image to Supabase Storage
    // --------------------------------------------------------
    let signatureUrl: string | undefined

    if (signature_data && signature_data.startsWith('data:image/')) {
      try {
        const base64Data = signature_data.replace(/^data:image\/\w+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')
        const signaturePath = `companies/${company_id}/signatures/${workOrderId}.png`

        const { error: uploadError } = await serviceClient.storage
          .from('fieldsign-assets')
          .upload(signaturePath, buffer, {
            contentType: 'image/png',
            upsert: true,
          })

        if (!uploadError) {
          const { data: { publicUrl } } = serviceClient.storage
            .from('fieldsign-assets')
            .getPublicUrl(signaturePath)
          signatureUrl = publicUrl

          await serviceClient.from('work_orders')
            .update({ signature_url: signatureUrl })
            .eq('id', workOrderId)
        }
      } catch (sigErr) {
        console.error('Signature upload error:', sigErr)
      }
    }

    // --------------------------------------------------------
    // STEP 8: Load field values for PDF generation
    // --------------------------------------------------------
    const { data: savedFieldValues } = await serviceClient
      .from('work_order_field_values')
      .select('*')
      .eq('work_order_id', workOrderId)
      .order('id')

    // Build enriched work order object for PDF
    const enrichedWorkOrder = {
      ...workOrder,
      swo: resolvedSwoId ? { swo_no: body.swo_no } : null,
      service: { service_name: service.service_name },
    }

    // --------------------------------------------------------
    // STEP 9: Generate PDF
    // --------------------------------------------------------
    let pdfUrl: string | undefined

    try {
      const pdfBuffer = await renderPdfToBuffer(
        company,
        enrichedWorkOrder as any,
        savedFieldValues ?? [],
        signatureUrl
      )

      const now = new Date()
      const pdfPath = `companies/${company_id}/reports/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${workOrderId}.pdf`

      const { error: pdfUploadError } = await serviceClient.storage
        .from('fieldsign-assets')
        .upload(pdfPath, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        })

      if (!pdfUploadError) {
        const { data: { publicUrl } } = serviceClient.storage
          .from('fieldsign-assets')
          .getPublicUrl(pdfPath)
        pdfUrl = publicUrl

        await serviceClient.from('work_orders')
          .update({ pdf_url: pdfUrl })
          .eq('id', workOrderId)
      }
    } catch (pdfErr) {
      console.error('PDF generation error:', pdfErr)
      // Don't fail the whole submission - log and continue
    }

    // --------------------------------------------------------
    // STEP 10: Send emails via Resend
    // --------------------------------------------------------
    const finalWorkOrder = {
      ...enrichedWorkOrder,
      pdf_url: pdfUrl,
      signature_url: signatureUrl,
    }

    if (pdfUrl) {
      try {
        // Re-fetch PDF buffer for email attachment
        const pdfBuffer = await renderPdfToBuffer(
          company,
          finalWorkOrder as any,
          savedFieldValues ?? [],
          signatureUrl
        )

        // Email to client
        const clientEmailResult = await sendReportEmail({
          company,
          workOrder: finalWorkOrder as any,
          recipientEmail: client_email,
          recipientType: 'client',
          pdfBuffer,
        })

        await serviceClient.from('email_logs').insert({
          company_id,
          work_order_id: workOrderId,
          recipient_email: client_email,
          recipient_type: 'client',
          subject: `Service Report ${serviceReportNo}`,
          status: clientEmailResult.success ? 'sent' : 'failed',
          provider_message_id: clientEmailResult.messageId ?? null,
          error_message: clientEmailResult.error ?? null,
          sent_at: clientEmailResult.success ? now : null,
        })

        // Email to company
        const companyEmailResult = await sendReportEmail({
          company,
          workOrder: finalWorkOrder as any,
          recipientEmail: company.company_email,
          recipientType: 'company',
          pdfBuffer,
        })

        await serviceClient.from('email_logs').insert({
          company_id,
          work_order_id: workOrderId,
          recipient_email: company.company_email,
          recipient_type: 'company',
          subject: `Service Report ${serviceReportNo}`,
          status: companyEmailResult.success ? 'sent' : 'failed',
          provider_message_id: companyEmailResult.messageId ?? null,
          error_message: companyEmailResult.error ?? null,
          sent_at: companyEmailResult.success ? now : null,
        })
      } catch (emailErr) {
        console.error('Email sending error:', emailErr)
      }
    }

    // --------------------------------------------------------
    // STEP 11: Update SWO status to Completed
    // --------------------------------------------------------
    if (resolvedSwoId) {
      await serviceClient.from('swos')
        .update({ status: 'Completed' })
        .eq('id', resolvedSwoId)
    }

    return NextResponse.json({
      success: true,
      data: {
        work_order_id: workOrderId,
        service_report_no: serviceReportNo,
        pdf_url: pdfUrl,
      },
    })

  } catch (err: any) {
    console.error('Report submission error:', err)
    return NextResponse.json(
      { success: false, error: err.message ?? 'Internal server error' },
      { status: 500 }
    )
  }
}
