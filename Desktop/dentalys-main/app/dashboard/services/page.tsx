// app/dashboard/services/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Stethoscope,
} from 'lucide-react'
import type { Service } from '@/types'

export default function ServicesPage() {
  const supabase = createClient()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [businessId, setBusinessId] = useState<string>('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    duration_minutes: 30,
    price: '',
    is_active: true,
  })

  const loadServices = useCallback(async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id')
      .single()
    if (!profile?.business_id) return
    setBusinessId(profile.business_id)

    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', profile.business_id)
      .order('sort_order', { ascending: true })
    if (data) setServices(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadServices()
  }, [loadServices])

  const openCreate = () => {
    setEditId(null)
    setForm({ name: '', description: '', duration_minutes: 30, price: '', is_active: true })
    setShowModal(true)
  }

  const openEdit = (service: Service) => {
    setEditId(service.id)
    setForm({
      name: service.name,
      description: service.description || '',
      duration_minutes: service.duration_minutes,
      price: service.price?.toString() || '',
      is_active: service.is_active,
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessId) return
    setSaving(true)

    const payload = {
      business_id: businessId,
      name: form.name,
      description: form.description || null,
      duration_minutes: form.duration_minutes,
      price: form.price ? parseFloat(form.price) : null,
      is_active: form.is_active,
    }

    if (editId) {
      await supabase.from('services').update(payload).eq('id', editId)
    } else {
      await supabase.from('services').insert(payload)
    }

    setSaving(false)
    setShowModal(false)
    loadServices()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    await supabase.from('services').delete().eq('id', id)
    loadServices()
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-stone-400">
          {services.length} service{services.length !== 1 ? 's' : ''}
        </p>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-[13px]">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {services.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-white py-16"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <Stethoscope className="mb-3 h-10 w-10 text-stone-300" />
          <p className="text-[14px] font-medium text-stone-600">No services yet</p>
          <p className="mt-1 text-[13px] text-stone-400">Add your first service to get started.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl bg-white p-5"
              style={{ border: '0.5px solid #e7e5e4' }}
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-[14px] font-medium text-stone-800">
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className="mt-1 text-[12px] text-stone-400 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    service.is_active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="mb-4 flex items-center gap-4 text-[12px] text-stone-500">
                <span>{service.duration_minutes} min</span>
                {service.price != null && (
                  <span>
                    {service.currency} {service.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(service)}
                  className="btn-ghost flex items-center gap-1.5 text-[12px]"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="btn-ghost flex items-center gap-1.5 text-[12px] text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 animate-fadeIn">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6"
            style={{ border: '0.5px solid #e7e5e4' }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[15px] font-medium text-stone-800">
                {editId ? 'Edit Service' : 'Add Service'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                  style={{ border: '0.5px solid #e7e5e4' }}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                  style={{ border: '0.5px solid #e7e5e4' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                    Duration (min) *
                  </label>
                  <input
                    type="number"
                    value={form.duration_minutes}
                    onChange={(e) =>
                      setForm({ ...form, duration_minutes: parseInt(e.target.value) || 0 })
                    }
                    min={5}
                    required
                    className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                    style={{ border: '0.5px solid #e7e5e4' }}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                    Price
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    step="0.01"
                    min={0}
                    className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                    style={{ border: '0.5px solid #e7e5e4' }}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-[13px] text-stone-600">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded"
                />
                Active
              </label>
              <button type="submit" disabled={saving} className="btn-primary w-full">
                {saving ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : editId ? (
                  'Update Service'
                ) : (
                  'Add Service'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
