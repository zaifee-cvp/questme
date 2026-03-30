'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceSchema, type ServiceInput } from '@/schemas'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, FormField, Modal, EmptyState, Badge, Spinner } from '@/components/ui'
import type { Service } from '@/types'
import { Plus, Edit2, Trash2, FileText, ArrowUp, ArrowDown } from 'lucide-react'

export default function ServicesPage() {
  const supabase = createClient()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchServices = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('services').select('*').order('sort_order', { ascending: true }).order('service_name')
    setServices(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchServices() }, [fetchServices])

  const openCreate = () => {
    setEditingService(null)
    reset({ service_name: '', is_active: true, sort_order: services.length })
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (svc: Service) => {
    setEditingService(svc)
    setValue('service_name', svc.service_name)
    setValue('is_active', svc.is_active)
    setValue('sort_order', svc.sort_order)
    setError(null)
    setModalOpen(true)
  }

  const onSubmit = async (data: ServiceInput) => {
    setSaveLoading(true)
    setError(null)
    try {
      if (editingService) {
        const { error } = await supabase.from('services').update(data).eq('id', editingService.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('services').insert({ ...data, sort_order: services.length })
        if (error) throw error
      }
      setModalOpen(false)
      fetchServices()
    } catch (err: any) {
      setError(err.message ?? 'Failed to save service')
    } finally {
      setSaveLoading(false)
    }
  }

  const toggleActive = async (svc: Service) => {
    await supabase.from('services').update({ is_active: !svc.is_active }).eq('id', svc.id)
    fetchServices()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('services').delete().eq('id', id)
    setDeleteId(null)
    fetchServices()
  }

  const moveService = async (svc: Service, direction: 'up' | 'down') => {
    const currentIndex = services.findIndex(s => s.id === svc.id)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= services.length) return

    const target = services[targetIndex]
    await Promise.all([
      supabase.from('services').update({ sort_order: target.sort_order }).eq('id', svc.id),
      supabase.from('services').update({ sort_order: svc.sort_order }).eq('id', target.id),
    ])
    fetchServices()
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500 text-sm mt-1">Define the service types your company offers</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add Service</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : services.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title="No services yet"
            description="Add your first service to start building report templates."
            action={<Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add Service</Button>}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {services.map((svc, i) => (
              <div key={svc.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveService(svc, 'up')}
                    disabled={i === 0}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-20"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveService(svc, 'down')}
                    disabled={i === services.length - 1}
                    className="text-gray-300 hover:text-gray-500 disabled:opacity-20"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex-1">
                  <p className="font-medium text-gray-900">{svc.service_name}</p>
                  <p className="text-xs text-gray-400">Sort order: {svc.sort_order}</p>
                </div>

                <Badge variant={svc.is_active ? 'success' : 'default'}>
                  {svc.is_active ? 'Active' : 'Inactive'}
                </Badge>

                <div className="flex items-center gap-2">
                  <a
                    href={`/dashboard/service-templates?service=${svc.id}`}
                    className="text-xs text-[#1e3a5f] hover:underline font-medium"
                  >
                    Edit Template
                  </a>
                  <button
                    onClick={() => toggleActive(svc)}
                    className="px-2.5 py-1 text-xs rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    {svc.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => openEdit(svc)} className="p-1.5 text-gray-400 hover:text-[#1e3a5f]">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteId(svc.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add Service'}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Service Name" required error={errors.service_name?.message}>
            <Input {...register('service_name')} placeholder="e.g. Pest Control, HVAC Maintenance" error={errors.service_name?.message} />
          </FormField>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_active" {...register('is_active')} className="h-4 w-4 rounded border-gray-300" />
            <label htmlFor="is_active" className="text-sm text-gray-700">Active (visible to technicians)</label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saveLoading} className="flex-1">
              {editingService ? 'Save Changes' : 'Add Service'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Service" size="sm">
        <p className="text-sm text-gray-600 mb-6">
          Deleting a service will also delete its report template fields. Work orders using this service will remain unaffected.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
          <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
