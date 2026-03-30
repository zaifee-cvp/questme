import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer'
import type { Company, WorkOrder, WorkOrderFieldValue } from '@/types'
import { formatDate, formatTime, formatDuration } from '@/lib/utils/formatters'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 30,
    paddingBottom: 50,
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a5f',
  },
  headerLeft: { flex: 1 },
  logo: { width: 80, height: 40, objectFit: 'contain', marginBottom: 6 },
  companyName: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#1e3a5f', marginBottom: 2 },
  companyDetails: { fontSize: 8, color: '#666666', lineHeight: 1.5 },
  headerRight: { alignItems: 'flex-end', minWidth: 160 },
  reportTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#1e3a5f', marginBottom: 4 },
  reportNo: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#e05a2b', marginBottom: 2 },
  reportDate: { fontSize: 8, color: '#666666' },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    backgroundColor: '#1e3a5f',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { width: '30%', fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#444444' },
  value: { flex: 1, fontSize: 9, color: '#222222' },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eeeeee',
  },
  fieldLabel: { width: '35%', fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#444444', paddingRight: 8 },
  fieldValue: { flex: 1, fontSize: 9, color: '#222222' },
  summaryBox: {
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#dddddd',
    marginTop: 4,
  },
  summaryText: { fontSize: 9, color: '#333333', lineHeight: 1.6 },
  signatureSection: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  signatureBox: { width: '45%' },
  signatureLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#444444',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  signatureImage: {
    width: '100%',
    height: 60,
    borderWidth: 0.5,
    borderColor: '#cccccc',
    backgroundColor: '#fafafa',
    marginBottom: 4,
  },
  signatureName: { fontSize: 9, color: '#333333', borderTopWidth: 0.5, borderTopColor: '#999999', paddingTop: 3 },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    borderTopWidth: 0.5,
    borderTopColor: '#cccccc',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: { fontSize: 7, color: '#999999' },
  pageNumber: { fontSize: 7, color: '#999999' },
})

interface ServiceReportPdfProps {
  company: Company
  workOrder: WorkOrder
  fieldValues: WorkOrderFieldValue[]
  signatureUrl?: string
}

export function ServiceReportPdf({ company, workOrder, fieldValues, signatureUrl }: ServiceReportPdfProps) {
  const durationText = workOrder.duration_minutes ? formatDuration(workOrder.duration_minutes) : '-'

  return (
    <Document title={`Service Report ${workOrder.service_report_no}`} author={company.company_name}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {company.logo_url && <Image style={styles.logo} src={company.logo_url} />}
            <Text style={styles.companyName}>{company.company_name}</Text>
            <Text style={styles.companyDetails}>
              {[company.company_address, company.company_phone, company.company_email].filter(Boolean).join('  |  ')}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.reportTitle}>Service Completion Report</Text>
            <Text style={styles.reportNo}>{workOrder.service_report_no}</Text>
            {workOrder.swo?.swo_no && <Text style={styles.reportDate}>SWO: {workOrder.swo.swo_no}</Text>}
            <Text style={styles.reportDate}>{workOrder.service_date ? formatDate(workOrder.service_date) : ''}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <View style={styles.row}><Text style={styles.label}>Client Name</Text><Text style={styles.value}>{workOrder.client_name}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Contact Number</Text><Text style={styles.value}>{workOrder.contact_number ?? '-'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Email</Text><Text style={styles.value}>{workOrder.client_email ?? '-'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Service Address</Text><Text style={styles.value}>{workOrder.service_address ?? '-'}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Details</Text>
          <View style={styles.row}><Text style={styles.label}>Service Type</Text><Text style={styles.value}>{workOrder.service?.service_name ?? '-'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Technician</Text><Text style={styles.value}>{workOrder.technician_name}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Service Date</Text><Text style={styles.value}>{workOrder.service_date ? formatDate(workOrder.service_date) : '-'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Start Time</Text><Text style={styles.value}>{workOrder.start_time ? formatTime(workOrder.start_time) : '-'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>End Time</Text><Text style={styles.value}>{workOrder.end_time ? formatTime(workOrder.end_time) : '-'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Total Duration</Text><Text style={styles.value}>{durationText}</Text></View>
        </View>

        {fieldValues.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Report Details</Text>
            {fieldValues.map((fv) => (
              <View key={fv.id} style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>{fv.field_label}</Text>
                <Text style={styles.fieldValue}>{fv.value_text ?? '-'}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Summary</Text>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>{workOrder.work_summary ?? '-'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Acknowledgement</Text>
          <View style={styles.signatureSection}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>Customer Signature</Text>
              {signatureUrl ? (
                <Image style={styles.signatureImage} src={signatureUrl} />
              ) : (
                <View style={styles.signatureImage} />
              )}
              <Text style={styles.signatureName}>{workOrder.client_name}</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>Technician</Text>
              <View style={[styles.signatureImage, { backgroundColor: '#fff' }]} />
              <Text style={styles.signatureName}>{workOrder.technician_name}</Text>
            </View>
          </View>
          {workOrder.report_submitted_at && (
            <View style={[styles.row, { marginTop: 8 }]}>
              <Text style={styles.label}>Date Signed</Text>
              <Text style={styles.value}>{formatDate(workOrder.report_submitted_at)}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {company.pdf_footer ?? `Thank you for choosing ${company.company_name}`}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}
