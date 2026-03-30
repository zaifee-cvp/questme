'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { swoSchema, type SwoInput } from '@/schemas'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Textarea, FormField, Modal, EmptyState, Badge, Spinner, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui'
import type { Swo, Client, Service, Technician } from '@/types'
import { Plus, Search, Edit2, ClipboardList } from 'lucide-react'
import { formatDate, getSwoStatusColor } from '@/lib/utils/formatters'
import Link from 'next/link'

const SWO_STATUSES = ['New', 'Assigned', 'In Progress', 'Completed', 'Cancelled']

export default function SwoPage() {
  const supabase = createClient()
  const [swos, setSwos] = useState<any[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSwo, setEditingSwo] = useState<any | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SwoInput>({
    resolver: zodResolver(swoSchema),
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = useCallback(async () => {
    setLoading(true)
    const [swoRes, clientRes, serviceRes, techRes] = await Promise.all([
      supabase
        .from('swos')
        .select('*, client:clients(client_name,contact_number,email), service:services(service_name), technician:technicians(name)')
        .order('created_at', { ascending: false }),
      supabase.from('clients').select('id,client_name').order('client_name'),
      supabase.from('services').select('id,service_name').eq('is_active', true),
      supabase.from('technicians').select('id,name').eq('status', 'active').order('name'),
    ])
    setSwos(swoRes.data ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setClients((clientRes.data ?? []) as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setServices((serviceRes.data ?? []) as any)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setTechnicians((techRes.data ?? []) as any)
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreate = () => {
    setEditingSwo(null)
    reset({ status: 'New' })
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (swo: any) => {
    setEditingSwo(swo)
    setValue('client_id', swo.client_id ?? '')
    setValue('service_id', swo.service_id ?? '')
    setValue('technician_id', swo.technician_id ?? '')
    setValue('service_address', swo.service_address ?? '')
    setValue('job_instructions', swo.job_instructions ?? '')
    setValue('scheduled_date', swo.scheduled_date ?? '')
    setValue('status', swo.status)
    setError(null)
    setModalOpen(true)
  }

  const onSubmit = async (data: SwoInput) => {
    setSaveLoading(true)
    setError(null)
    const cleanData = {
      client_id: data.client_id || null,
      service_id: data.service_id || null,
      technician_id: data.technician_id || null,
      service_address: data.service_address || null,
      job_instructions: data.job_instructions || null,
      scheduled_date: data.scheduled_date || null,
      status: data.status,
    }

    try {
      if (editingSwo) {
        const { error } = await supabase.from('swos').update(cleanData).eq('id', editingSwo.id)
        if (error) throw error
      } else {
        const response = await fetch('/api/swos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanData),
        })
        const result = await response.json()
        if (!result.success) throw new Error(result.error)
      }
      setModalOpen(false)
      fetchData()
    } catch (err: any) {
      setError(err.message ?? 'Failed to save SWO')
    } finally {
      setSaveLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('swos').update({ status }).eq('id', id)
    fetchData()
  }

  const filtered = swos.filter(swo => {
    const matchSearch = !search ||
      swo.swo_no.toLowerCase().includes(search.toLowerCase()) ||
      (swo.client?.client_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (swo.technician?.name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || swo.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Orders (SWO)</h1>
          <p className="text-gray-500 text-sm mt-1">{swos.length} total · {swos.filter(s => s.status !== 'Completed' && s.status !== 'Cancelled').length} open</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Create SWO</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by SWO#, client, or technician..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 bg-white"
        >
          <option value="">All Statuses</option>
          {SWO_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-12 w-12" />}
            title={search || statusFilter ? 'No results found' : 'No work orders yet'}
            description={search || statusFilter ? 'Try adjusting your search or filters.' : 'Create your first work order to get started.'}
            action={!search && !statusFilter ? <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Create SWO</Button> : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SWO #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(swo => (
                  <TableRow key={swo.id}>
                    <TableCell className="font-mono font-semibold text-[#1e3a5f] text-sm">{swo.swo_no}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{swo.client?.client_name ?? 'No client'}</p>
                        {swo.client?.contact_number && (
                          <p className="text-xs text-gray-400">{swo.client.contact_number}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">{swo.service?.service_name ?? '-'}</TableCell>
                    <TableCell className="text-gray-600 text-sm">{swo.technician?.name ?? 'Unassigned'}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{swo.scheduled_date ? formatDate(swo.scheduled_date) : '-'}</TableCell>
                    <TableCell>
                      <select
                        value={swo.status}
                        onChange={e => updateStatus(swo.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer ${getSwoStatusColor(swo.status)}`}
                      >
                        {SWO_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(swo)} className="p-1.5 text-gray-400 hover:text-[#1e3a5f]">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingSwo ? `Edit SWO ${editingSwo.swo_no}` : 'Create Work Order'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Client">
              <select {...register('client_id')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">-- Select client --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.client_name}</option>)}
              </select>
            </FormField>
            <FormField label="Service">
              <select {...register('service_id')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">-- Select service --</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.service_name}</option>)}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Assign Technician">
              <select {...register('technician_id')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">-- Unassigned --</option>
                {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </FormField>
            <FormField label="Scheduled Date">
              <Input type="date" {...register('scheduled_date')} />
            </FormField>
          </div>

          <FormField label="Service Address">
            <Textarea {...register('service_address')} placeholder="Site address for this job..." rows={2} />
          </FormField>

          <FormField label="Job Instructions">
            <Textarea {...register('job_instructions')} placeholder="Describe what the technician needs to do..." rows={3} />
          </FormField>

          {editingSwo && (
            <FormField label="Status">
              <select {...register('status')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {SWO_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saveLoading} className="flex-1">
              {editingSwo ? 'Save Changes' : 'Create SWO'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
