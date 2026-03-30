'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTechSession } from '@/contexts/TechContext'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Spinner, Badge } from '@/components/ui'
import { ClipboardList, Plus, Clock, ChevronRight, LogOut, RefreshCw } from 'lucide-react'
import { formatDate, getSwoStatusColor } from '@/lib/utils/formatters'
import Link from 'next/link'

export default function TechHomeInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { session, loading: sessionLoading, setSession, clearSession } = useTechSession()
  const supabase = createClient()

  const [validating, setValidating] = useState(false)
  const [validateError, setValidateError] = useState<string | null>(null)
  const [swos, setSwos] = useState<any[]>([])
  const [recentReports, setRecentReports] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  const tokenParam = searchParams.get('token')

  // On mount: if token in URL, validate it
  useEffect(() => {
    if (sessionLoading) return
    if (tokenParam) {
      validateToken(tokenParam)
    }
  }, [tokenParam, sessionLoading])

  // Once we have a session, load data
  useEffect(() => {
    if (session) loadData()
  }, [session])

  const validateToken = async (token: string) => {
    setValidating(true)
    setValidateError(null)
    try {
      const res = await fetch(`/api/technician/validate?token=${token}`)
      const result = await res.json()
      if (!result.success) {
        setValidateError(result.error ?? 'Invalid QR code')
        return
      }
      setSession({ ...result.data, token })
      // Clean token from URL
      router.replace('/tech')
    } catch {
      setValidateError('Failed to validate QR code. Please try again.')
    } finally {
      setValidating(false)
    }
  }

  const loadData = async () => {
    if (!session) return
    setDataLoading(true)
    const [swoRes, reportRes] = await Promise.all([
      supabase
        .from('swos')
        .select('*, client:clients(client_name,contact_number), service:services(service_name)')
        .eq('company_id', session.company_id)
        .eq('technician_id', session.technician_id)
        .in('status', ['New', 'Assigned', 'In Progress'])
        .order('scheduled_date', { ascending: true }),
      supabase
        .from('work_orders')
        .select('id, service_report_no, client_name, service_date, status, service:services(service_name)')
        .eq('company_id', session.company_id)
        .eq('technician_id', session.technician_id)
        .order('created_at', { ascending: false })
        .limit(5),
    ])
    setSwos(swoRes.data ?? [])
    setRecentReports(reportRes.data ?? [])
    setDataLoading(false)
  }

  // LOADING STATE
  if (sessionLoading || validating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500 text-sm">{validating ? 'Verifying your QR code...' : 'Loading...'}</p>
      </div>
    )
  }

  // ERROR STATE (invalid QR)
  if (validateError && !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 text-sm mb-6">{validateError}</p>
        <p className="text-xs text-gray-400">Please ask your admin to provide a valid QR code.</p>
      </div>
    )
  }

  // NO SESSION - Ask for QR scan
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#1e3a5f] flex items-center justify-center mb-6">
          <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Technician Access</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Scan the QR code provided by your company admin to access your work orders.
        </p>
      </div>
    )
  }

  // MAIN APP
  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-[#1e3a5f] px-5 pt-10 pb-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-[#9cb3cc] text-xs uppercase tracking-wider mb-1">Welcome back</p>
            <h1 className="text-white text-xl font-bold">{session.technician_name}</h1>
            <p className="text-[#9cb3cc] text-sm">{session.company_name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 text-[#9cb3cc] hover:text-white transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={clearSession}
              className="p-2 text-[#9cb3cc] hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-2">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6 mt-4">
          <Link
            href="/tech/report/new"
            className="bg-[#e05a2b] text-white rounded-xl p-4 flex flex-col gap-2 shadow-sm active:scale-95 transition-transform"
          >
            <Plus className="h-6 w-6" />
            <div>
              <p className="font-semibold text-sm">New Job</p>
              <p className="text-xs opacity-80">Create & start report</p>
            </div>
          </Link>
          <div
            onClick={loadData}
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm cursor-pointer active:scale-95 transition-transform"
          >
            <ClipboardList className="h-6 w-6 text-[#1e3a5f]" />
            <div>
              <p className="font-semibold text-sm text-gray-900">My SWOs</p>
              <p className="text-xs text-gray-500">{swos.length} assigned</p>
            </div>
          </div>
        </div>

        {/* Assigned SWOs */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3">Assigned Work Orders</h2>
          {dataLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : swos.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <ClipboardList className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No work orders assigned</p>
              <p className="text-xs text-gray-400 mt-1">New jobs will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {swos.map(swo => (
                <Link
                  key={swo.id}
                  href={`/tech/swo/${swo.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-4 active:scale-98 transition-transform shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-semibold text-[#1e3a5f] bg-[#f0f4f9] px-2 py-0.5 rounded">
                          {swo.swo_no}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getSwoStatusColor(swo.status)}`}>
                          {swo.status}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {swo.client?.client_name ?? 'No client'}
                      </p>
                      {swo.client?.contact_number && (
                        <p className="text-xs text-gray-500 mt-0.5">{swo.client.contact_number}</p>
                      )}
                      {swo.service?.service_name && (
                        <p className="text-xs text-gray-400 mt-0.5">{swo.service.service_name}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {swo.scheduled_date && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {formatDate(swo.scheduled_date)}
                        </div>
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reports */}
        {recentReports.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">Recent Reports</h2>
            <div className="space-y-2">
              {recentReports.map(report => (
                <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs font-semibold text-[#1e3a5f]">{report.service_report_no}</p>
                      <p className="text-sm text-gray-700 mt-0.5">{report.client_name}</p>
                      <p className="text-xs text-gray-400">{report.service?.service_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{report.service_date ? formatDate(report.service_date) : ''}</p>
                      <Badge variant="success" className="mt-1">Submitted</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
