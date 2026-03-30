'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Modal, EmptyState, Badge, Spinner, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui'
import type { QrCode, Technician } from '@/types'
import { Plus, Download, RefreshCw, Ban, QrCode as QrCodeIcon, Clock } from 'lucide-react'
import { formatDateTime } from '@/lib/utils/formatters'

export default function QrCodesPage() {
  const supabase = createClient()
  const [qrCodes, setQrCodes] = useState<(QrCode & { technician: Technician })[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedTechId, setSelectedTechId] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qrDataUrls, setQrDataUrls] = useState<Record<string, string>>({})

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = useCallback(async () => {
    setLoading(true)
    const [qrRes, techRes] = await Promise.all([
      supabase.from('qr_codes').select('*, technician:technicians(*)').order('created_at', { ascending: false }),
      supabase.from('technicians').select('*').eq('status', 'active').order('name'),
    ])
    setQrCodes((qrRes.data ?? []) as any)
    setTechnicians(techRes.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Generate QR data URLs for display
  useEffect(() => {
    const generateQrs = async () => {
      const appUrl = window.location.origin
      const urls: Record<string, string> = {}
      for (const qr of qrCodes) {
        try {
          const response = await fetch(`/api/qr/generate?token=${qr.qr_token}`)
          if (response.ok) {
            const data = await response.json()
            urls[qr.id] = data.dataUrl
          }
        } catch {}
      }
      setQrDataUrls(urls)
    }
    if (qrCodes.length > 0) generateQrs()
  }, [qrCodes])

  const handleCreate = async () => {
    if (!selectedTechId) return
    setCreating(true)
    setError(null)
    try {
      const response = await fetch('/api/qr/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technician_id: selectedTechId }),
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error)
      setCreateModalOpen(false)
      setSelectedTechId('')
      fetchData()
    } catch (err: any) {
      setError(err.message ?? 'Failed to create QR code')
    } finally {
      setCreating(false)
    }
  }

  const handleDisable = async (id: string) => {
    await supabase.from('qr_codes').update({ status: 'disabled' }).eq('id', id)
    fetchData()
  }

  const handleRegenerate = async (id: string) => {
    const response = await fetch('/api/qr/regenerate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr_id: id }),
    })
    const result = await response.json()
    if (result.success) fetchData()
  }

  const handleDownload = (qrId: string, techName: string) => {
    const dataUrl = qrDataUrls[qrId]
    if (!dataUrl) return
    const link = document.createElement('a')
    link.download = `QR_${techName.replace(/\s+/g, '_')}.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR Codes</h1>
          <p className="text-gray-500 text-sm mt-1">Generate and manage technician access QR codes</p>
        </div>
        <Button onClick={() => { setError(null); setCreateModalOpen(true) }}>
          <Plus className="h-4 w-4 mr-1" />Generate QR Code
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : qrCodes.length === 0 ? (
          <EmptyState
            icon={<QrCodeIcon className="h-12 w-12" />}
            title="No QR codes yet"
            description="Generate QR codes for your technicians so they can access the mobile app."
            action={<Button onClick={() => setCreateModalOpen(true)}><Plus className="h-4 w-4 mr-1" />Generate QR Code</Button>}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {qrCodes.map(qr => (
              <div key={qr.id} className="flex items-center gap-6 px-6 py-5">
                {/* QR Image */}
                <div className="flex-shrink-0 h-20 w-20 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  {qrDataUrls[qr.id] ? (
                    <img src={qrDataUrls[qr.id]} alt="QR Code" className="h-full w-full object-contain" />
                  ) : (
                    <QrCodeIcon className="h-8 w-8 text-gray-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">{qr.technician?.name ?? 'Unknown'}</p>
                    <Badge variant={qr.status === 'active' ? 'success' : 'danger'}>
                      {qr.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 font-mono truncate">{qr.qr_token}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {qr.last_used_at ? `Last used: ${formatDateTime(qr.last_used_at)}` : 'Never used'}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {qr.status === 'active' && qrDataUrls[qr.id] && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(qr.id, qr.technician?.name ?? 'technician')}
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />Download
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRegenerate(qr.id)}
                    title="Regenerate token (invalidates old QR)"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />Regenerate
                  </Button>
                  {qr.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDisable(qr.id)}
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      <Ban className="h-3.5 w-3.5 mr-1" />Disable
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create QR Modal */}
      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Generate QR Code" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Select a technician to generate a unique QR code. When scanned, it opens the mobile technician app and authenticates them automatically.
          </p>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Select Technician</label>
            <select
              value={selectedTechId}
              onChange={e => setSelectedTechId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">-- Select a technician --</option>
              {technicians.map(t => (
                <option key={t.id} value={t.id}>{t.name}{t.employee_id ? ` (${t.employee_id})` : ''}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleCreate} loading={creating} disabled={!selectedTechId} className="flex-1">
              Generate QR Code
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
