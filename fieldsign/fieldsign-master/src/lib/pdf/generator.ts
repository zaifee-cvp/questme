import React from 'react'
import type { Company, WorkOrder, WorkOrderFieldValue } from '@/types'

export async function renderPdfToBuffer(
  company: Company,
  workOrder: WorkOrder,
  fieldValues: WorkOrderFieldValue[],
  signatureUrl?: string
): Promise<Buffer> {
  const { renderToBuffer } = await import('@react-pdf/renderer')
  const { ServiceReportPdf } = await import('./ServiceReportPdf')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = React.createElement(ServiceReportPdf as any, {
    company,
    workOrder,
    fieldValues,
    signatureUrl,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any)
  return Buffer.from(buffer)
}
