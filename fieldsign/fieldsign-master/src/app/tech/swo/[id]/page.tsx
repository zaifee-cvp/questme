'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTechSession } from '@/contexts/TechContext'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui'
import { ArrowLeft, MapPin, FileText, User, ClipboardCheck } from 'lucide-react'
import { formatDate, getSwoStatusColor } from '@/lib/utils/formatters'
import Link from 'next/link'

export default function TechSwoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { session } = useTechSession()
  const supabase = createClient()
  const [swo, setSwo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session || !id) return
    const fetchSwo = async () => {
      const { data } = await supabase
        .from('swos')
        .select(`
          *, 
          client:clients(*), 
          service:services(id, service_name),
          technician:technicians(name)
        `)
        .eq('id', id)
        .eq('company_id', session.company_id)
        .eq('technician_id', session.technician_id)
        .single()
      setSwo(data)
      setLoading(false)
    }
    fetchSwo()
  }, [id, session])

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Please scan your QR code to access.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Spinner size="lg" /></div>
  }

  if (!swo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p className="text-gray-500 mb-4">Work order not found or not assigned to you.</p>
        <Button variant="outline" onClick={() => router.push('/tech')}>Go Back</Button>
      </div>
    )
  }

  const canStartReport = swo.status !== 'Completed' && swo.status !== 'Cancelled'

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-[#1e3a5f] px-4 pt-10 pb-5">
        <button onClick={() => router.push('/tech')} className="flex items-center gap-2 text-[#9cb3cc] mb-4 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[#9cb3cc] text-xs uppercase tracking-wider mb-1">Work Order</p>
            <h1 className="text-white text-xl font-bold font-mono">{swo.swo_no}</h1>
          </div>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${getSwoStatusColor(swo.status)}`}>
            {swo.status}
          </span>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Client Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-gray-400" />
            <h2 className="font-semibold text-gray-900 text-sm">Client Details</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium text-gray-900">{swo.client?.client_name ?? '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Contact</span>
              <a href={`tel:${swo.client?.contact_number}`} className="font-medium text-[#1e3a5f]">
                {swo.client?.contact_number ?? '-'}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-900 truncate max-w-[200px]">{swo.client?.email ?? '-'}</span>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-gray-400" />
            <h2 className="font-semibold text-gray-900 text-sm">Job Details</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Service</span>
              <span className="font-medium text-gray-900">{swo.service?.service_name ?? '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Scheduled</span>
              <span className="font-medium text-gray-900">
                {swo.scheduled_date ? formatDate(swo.scheduled_date) : 'Not scheduled'}
              </span>
            </div>
          </div>
        </div>

        {/* Service Address */}
        {swo.service_address && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <h2 className="font-semibold text-gray-900 text-sm">Service Address</h2>
            </div>
            <p className="text-sm text-gray-700">{swo.service_address}</p>
          </div>
        )}

        {/* Job Instructions */}
        {swo.job_instructions && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardCheck className="h-4 w-4 text-amber-600" />
              <h2 className="font-semibold text-amber-900 text-sm">Instructions</h2>
            </div>
            <p className="text-sm text-amber-800 whitespace-pre-wrap">{swo.job_instructions}</p>
          </div>
        )}

        {/* Start Report Button */}
        {canStartReport ? (
          <Link href={`/tech/report/new?swo_id=${swo.id}`} className="block">
            <Button size="xl" className="w-full bg-[#e05a2b] hover:bg-[#c74e22]">
              <ClipboardCheck className="h-5 w-5 mr-2" />
              Start Service Report
            </Button>
          </Link>
        ) : (
          <div className="bg-gray-100 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">This work order is {swo.status.toLowerCase()}.</p>
          </div>
        )}
      </div>
    </div>
  )
}
