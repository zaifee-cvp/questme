// app/dashboard/faq/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  HelpCircle,
  GripVertical,
} from 'lucide-react'
import type { FaqItem } from '@/types'

export default function FaqPage() {
  const supabase = createClient()
  const [items, setItems] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [businessId, setBusinessId] = useState<string>('')
  const [form, setForm] = useState({
    question: '',
    answer: '',
    is_active: true,
  })

  const loadFaq = useCallback(async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id')
      .single()
    if (!profile?.business_id) return
    setBusinessId(profile.business_id)

    const { data } = await supabase
      .from('faq_items')
      .select('*')
      .eq('business_id', profile.business_id)
      .order('sort_order', { ascending: true })
    if (data) setItems(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadFaq()
  }, [loadFaq])

  const openCreate = () => {
    setEditId(null)
    setForm({ question: '', answer: '', is_active: true })
    setShowModal(true)
  }

  const openEdit = (item: FaqItem) => {
    setEditId(item.id)
    setForm({
      question: item.question,
      answer: item.answer,
      is_active: item.is_active,
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessId) return
    setSaving(true)

    const payload = {
      business_id: businessId,
      question: form.question,
      answer: form.answer,
      is_active: form.is_active,
    }

    if (editId) {
      await supabase.from('faq_items').update(payload).eq('id', editId)
    } else {
      await supabase
        .from('faq_items')
        .insert({ ...payload, sort_order: items.length })
    }

    setSaving(false)
    setShowModal(false)
    loadFaq()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ item?')) return
    await supabase.from('faq_items').delete().eq('id', id)
    loadFaq()
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-stone-400">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={openCreate}
          className="btn-primary flex items-center gap-2 text-[13px]"
        >
          <Plus className="h-4 w-4" /> Add FAQ
        </button>
      </div>

      {items.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-white py-16"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <HelpCircle className="mb-3 h-10 w-10 text-stone-300" />
          <p className="text-[14px] font-medium text-stone-600">
            No FAQ items yet
          </p>
          <p className="mt-1 text-[13px] text-stone-400">
            Add questions the AI can answer for your customers.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-5"
              style={{ border: '0.5px solid #e7e5e4' }}
            >
              <div className="flex items-start gap-3">
                <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-stone-300" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[14px] font-medium text-stone-800">
                      {item.question}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        item.is_active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-stone-500">
                    {item.answer}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="btn-ghost flex items-center gap-1.5 text-[12px]"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn-ghost flex items-center gap-1.5 text-[12px] text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
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
                {editId ? 'Edit FAQ' : 'Add FAQ'}
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
                  Question *
                </label>
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) =>
                    setForm({ ...form, question: e.target.value })
                  }
                  required
                  className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                  style={{ border: '0.5px solid #e7e5e4' }}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                  Answer *
                </label>
                <textarea
                  value={form.answer}
                  onChange={(e) =>
                    setForm({ ...form, answer: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                  style={{ border: '0.5px solid #e7e5e4' }}
                />
              </div>
              <label className="flex items-center gap-2 text-[13px] text-stone-600">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                  className="rounded"
                />
                Active
              </label>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full"
              >
                {saving ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : editId ? (
                  'Update FAQ'
                ) : (
                  'Add FAQ'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
