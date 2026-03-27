// app/dashboard/promotions/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, X, Loader2, Tag } from 'lucide-react'
import type { Promotion } from '@/types'

export default function PromotionsPage() {
  const supabase = createClient()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [businessId, setBusinessId] = useState<string>('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    promo_code: '',
    first_time_only: false,
    valid_from: '',
    valid_until: '',
    is_active: true,
  })

  const loadPromotions = useCallback(async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id')
      .single()
    if (!profile?.business_id) return
    setBusinessId(profile.business_id)

    const { data } = await supabase
      .from('promotions')
      .select('*')
      .eq('business_id', profile.business_id)
      .order('created_at', { ascending: false })
    if (data) setPromotions(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadPromotions()
  }, [loadPromotions])

  const openCreate = () => {
    setEditId(null)
    setForm({
      title: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      promo_code: '',
      first_time_only: false,
      valid_from: '',
      valid_until: '',
      is_active: true,
    })
    setShowModal(true)
  }

  const openEdit = (promo: Promotion) => {
    setEditId(promo.id)
    setForm({
      title: promo.title,
      description: promo.description || '',
      discount_type: promo.discount_type,
      discount_value: promo.discount_value.toString(),
      promo_code: promo.promo_code || '',
      first_time_only: promo.first_time_only,
      valid_from: promo.valid_from?.split('T')[0] || '',
      valid_until: promo.valid_until?.split('T')[0] || '',
      is_active: promo.is_active,
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessId) return
    setSaving(true)

    const payload = {
      business_id: businessId,
      title: form.title,
      description: form.description || null,
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value) || 0,
      promo_code: form.promo_code || null,
      first_time_only: form.first_time_only,
      valid_from: form.valid_from || null,
      valid_until: form.valid_until || null,
      is_active: form.is_active,
    }

    if (editId) {
      await supabase.from('promotions').update(payload).eq('id', editId)
    } else {
      await supabase.from('promotions').insert(payload)
    }

    setSaving(false)
    setShowModal(false)
    loadPromotions()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this promotion?')) return
    await supabase.from('promotions').delete().eq('id', id)
    loadPromotions()
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
          {promotions.length} promotion{promotions.length !== 1 ? 's' : ''}
        </p>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-[13px]">
          <Plus className="h-4 w-4" /> Add Promotion
        </button>
      </div>

      {promotions.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-white py-16"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <Tag className="mb-3 h-10 w-10 text-stone-300" />
          <p className="text-[14px] font-medium text-stone-600">No promotions yet</p>
          <p className="mt-1 text-[13px] text-stone-400">Create your first promotion to attract customers.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="rounded-2xl bg-white p-5"
              style={{ border: '0.5px solid #e7e5e4' }}
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-[14px] font-medium text-stone-800">
                  {promo.title}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    promo.is_active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {promo.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              {promo.description && (
                <p className="mb-3 text-[12px] text-stone-400 line-clamp-2">
                  {promo.description}
                </p>
              )}
              <div className="mb-4 flex flex-wrap gap-2 text-[12px]">
                <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                  {promo.discount_type === 'percentage'
                    ? `${promo.discount_value}% off`
                    : `$${promo.discount_value} off`}
                </span>
                {promo.promo_code && (
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 font-medium text-stone-600">
                    {promo.promo_code}
                  </span>
                )}
                {promo.first_time_only && (
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 font-medium text-sky-700">
                    First-time only
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(promo)}
                  className="btn-ghost flex items-center gap-1.5 text-[12px]"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(promo.id)}
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
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
            style={{ border: '0.5px solid #e7e5e4' }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[15px] font-medium text-stone-800">
                {editId ? 'Edit Promotion' : 'Add Promotion'}
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
                <label className="mb-1.5 block text-[12px] font-medium text-stone-600">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                  style={{ border: '0.5px solid #e7e5e4' }}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-stone-600">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                  style={{ border: '0.5px solid #e7e5e4' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-stone-600">Discount Type</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) =>
                      setForm({ ...form, discount_type: e.target.value as 'percentage' | 'fixed' })
                    }
                    className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                    style={{ border: '0.5px solid #e7e5e4' }}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-stone-600">Value *</label>
                  <input
                    type="number"
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                    required
                    min={0}
                    className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                    style={{ border: '0.5px solid #e7e5e4' }}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-stone-600">Promo Code</label>
                <input
                  type="text"
                  value={form.promo_code}
                  onChange={(e) => setForm({ ...form, promo_code: e.target.value })}
                  className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                  style={{ border: '0.5px solid #e7e5e4' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-stone-600">Valid From</label>
                  <input
                    type="date"
                    value={form.valid_from}
                    onChange={(e) => setForm({ ...form, valid_from: e.target.value })}
                    className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                    style={{ border: '0.5px solid #e7e5e4' }}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-stone-600">Valid Until</label>
                  <input
                    type="date"
                    value={form.valid_until}
                    onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                    className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                    style={{ border: '0.5px solid #e7e5e4' }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[13px] text-stone-600">
                  <input
                    type="checkbox"
                    checked={form.first_time_only}
                    onChange={(e) => setForm({ ...form, first_time_only: e.target.checked })}
                    className="rounded"
                  />
                  First-time customers only
                </label>
                <label className="flex items-center gap-2 text-[13px] text-stone-600">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="rounded"
                  />
                  Active
                </label>
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full">
                {saving ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : editId ? (
                  'Update Promotion'
                ) : (
                  'Add Promotion'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
