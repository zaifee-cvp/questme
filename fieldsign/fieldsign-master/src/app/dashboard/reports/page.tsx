'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { EmptyState, Badge, Spinner, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui'
import { PlanLimitBanner } from '@/components/ui/plan-limit-banner'
import { Search, Download, Mail, BarChart3, X } from 'lucide-react'
import { formatDate, formatTime, formatDuration } from '@/lib/utils/formatters'

interface PlanInfo {
  plan: string
  limits: { reports_per_month: number }
}

export default function ReportsPage() {
  const supabase = createClient()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')
  const [techFilter, setTechFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [extensionFilter, setExtensionFilter] = useState('')
  const [services, setServices] = useState<any[]>([])
  const [technicians, setTechnicians] = useState<any[]>([])
  const [resendingId, setResendingId] = useState<string | null>(null)
  const [resendMsg, setResendMsg] = useState<{ id: string; msg: string } | null>(null)
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [reportsRes, servicesRes, techsRes] = await Promise.all([
      supabase
        .from('work_orders')
        .select(`
          id, service_report_no, client_name, contact_number, client_email,
          technician_name, service_date, start_time, end_time, duration_minutes,
          extension_requested, status, pdf_url, swo_id,
          service:services(service_name),
          swo:swos(swo_no)
        `)
        .eq('status', 'Completed')
        .order('created_at', { ascending: false }),
      supabase.from('services').select('id, service_name').order('service_name'),
      supabase.from('technicians').select('id, name').order('name'),
    ])
    setReports(reportsRes.data ?? [])
    setServices(servicesRes.data ?? [])
    setTechnicians(techsRes.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
    fetch('/api/billing/limits').then(r => r.ok ? r.json() : null).then(d => { if (d) setPlanInfo(d) }).catch(() => {})
  }, [fetchData])

  const handleResend = async (reportId: string) => {
    setResendingId(reportId)
    setResendMsg(null)
    try {
      const response = await fetch('/api/reports/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ work_order_id: reportId }),
      })
      const result = await response.json()
      setResendMsg({
        id: reportId,
        msg: result.success ? '✓ Email resent successfully' : `✗ ${result.error}`,
      })
    } catch {
      setResendMsg({ id: reportId, msg: '✗ Failed to resend' })
    } finally {
      setResendingId(null)
    }
  }

  const clearFilters = () => {
    setSearch(''); setServiceFilter(''); setTechFilter('')
    setDateFrom(''); setDateTo(''); setExtensionFilter('')
  }

  const hasFilters = search || serviceFilter || techFilter || dateFrom || dateTo || extensionFilter

  const filtered = reports.filter(r => {
    const matchSearch = !search || [
      r.service_report_no,
      r.swo?.swo_no ?? '',
      r.client_name,
      r.contact_number ?? '',
      r.technician_name,
    ].some(v => v.toLowerCase().includes(search.toLowerCase()))

    const matchService = !serviceFilter || r.service?.service_name === serviceFilter
    const matchTech = !techFilter || r.technician_name === techFilter
    const matchDateFrom = !dateFrom || r.service_date >= dateFrom
    const matchDateTo = !dateTo || r.service_date <= dateTo
    const matchExtension = !extensionFilter ||
      (extensionFilter === 'yes' ? r.extension_requested : !r.extension_requested)

    return matchSearch && matchService && matchTech && matchDateFrom && matchDateTo && matchExtension
  })

  // Compute this month's report count from already-fetched data
  const now = new Date()
  const thisMonthReports = reports.filter(r => {
    const d = new Date(r.created_at ?? r.service_date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length
  const reportLimit = planInfo?.limits.reports_per_month ?? -1

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Reports</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} of {reports.length} reports</p>
        </div>
      </div>

      {/* Plan limit banner */}
      {planInfo && (
        <PlanLimitBanner
          current={thisMonthReports}
          limit={reportLimit}
          label="Reports this month"
          icon={<BarChart3 className="h-4 w-4" />}
          className="mb-4"
        />
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by report#, SWO#, client name, contact, or technician..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
            className="h-9 rounded-md border border-gray-200 px-3 text-sm bg-white focus:outline-none"
          >
            <option value="">All Services</option>
            {services.map(s => <option key={s.id} value={s.service_name}>{s.service_name}</option>)}
          </select>
          <select
            value={techFilter}
            onChange={e => setTechFilter(e.target.value)}
            className="h-9 rounded-md border border-gray-200 px-3 text-sm bg-white focus:outline-none"
          >
            <option value="">All Technicians</option>
            {technicians.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="h-9 rounded-md border border-gray-200 px-3 text-sm bg-white focus:outline-none"
            placeholder="From date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="h-9 rounded-md border border-gray-200 px-3 text-sm bg-white focus:outline-none"
          />
          <select
            value={extensionFilter}
            onChange={e => setExtensionFilter(e.target.value)}
            className="h-9 rounded-md border border-gray-200 px-3 text-sm bg-white focus:outline-none"
          >
            <option value="">Extension: All</option>
            <option value="yes">Extension Used</option>
            <option value="no">No Extension</option>
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="h-9 px-3 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 border border-gray-200 rounded-md">
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<BarChart3 className="h-12 w-12" />}
            title={hasFilters ? 'No reports match your filters' : 'No completed reports yet'}
            description={hasFilters ? 'Try adjusting your search or filters.' : 'Reports will appear here after technicians submit them.'}
            action={hasFilters ? <Button variant="outline" onClick={clearFilters}>Clear Filters</Button> : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report #</TableHead>
                  <TableHead>SWO #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Ext.</TableHead>
                  <TableHead>PDF</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <span className="font-mono font-semibold text-[#1e3a5f] text-sm whitespace-nowrap">
                        {r.service_report_no}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 font-mono">
                      {r.swo?.swo_no ?? '-'}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900 whitespace-nowrap">{r.client_name}</p>
                        <p className="text-xs text-gray-400">{r.client_email ?? ''}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">{r.contact_number ?? '-'}</TableCell>
                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">{r.service?.service_name ?? '-'}</TableCell>
                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">{r.technician_name}</TableCell>
                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                      {r.service_date ? formatDate(r.service_date) : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{r.start_time ? formatTime(r.start_time) : '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500">{r.end_time ? formatTime(r.end_time) : '-'}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {r.duration_minutes ? formatDuration(r.duration_minutes) : '-'}
                    </TableCell>
                    <TableCell>
                      {r.extension_requested ? (
                        <Badge variant="warning">Yes</Badge>
                      ) : (
                        <span className="text-xs text-gray-400">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.pdf_url ? (
                        <a
                          href={r.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#1e3a5f] hover:underline text-xs font-medium"
                        >
                          <Download className="h-3.5 w-3.5" />PDF
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleResend(r.id)}
                        disabled={resendingId === r.id}
                        className="inline-flex items-center gap-1 text-gray-500 hover:text-[#1e3a5f] text-xs transition-colors disabled:opacity-50"
                      >
                        {resendingId === r.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <Mail className="h-3.5 w-3.5" />
                        )}
                        {resendMsg != null && resendMsg.id === r.id ? (
                          <span className={resendMsg.msg.startsWith('✓') ? 'text-green-600' : 'text-red-500'}>
                            {resendMsg.msg}
                          </span>
                        ) : 'Resend'}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
