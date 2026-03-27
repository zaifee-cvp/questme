// app/dashboard/customers/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Plus,
  Search,
  Upload,
  X,
  Loader2,
  Users,
} from 'lucide-react'
import type { Customer } from '@/types'

export default function CustomersPage() {
  const supabase = createClient()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [businessId, setBusinessId] = useState<string>('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    is_first_time: true,
  })

  const loadCustomers = useCallback(async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id')
      .single()
    if (!profile?.business_id) return
    setBusinessId(profile.business_id)

    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('business_id', profile.business_id)
      .order('created_at', { ascending: false })
      .limit(100)
    if (data) setCustomers(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  const filtered = customers.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.name?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    )
  })

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessId) return
    setSaving(true)

    await supabase.from('customers').insert({
      business_id: businessId,
      name: form.name || null,
      phone: form.phone || null,
      email: form.email || null,
      notes: form.notes || null,
      is_first_time: form.is_first_time,
      import_source: 'manual',
    })

    setSaving(false)
    setShowModal(false)
    setForm({ name: '', phone: '', email: '', notes: '', is_first_time: true })
    loadCustomers()
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
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-white py-2 pl-9 pr-3 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
            style={{ border: '0.5px solid #e7e5e4' }}
          />
        </div>
        <Link
          href="/dashboard/customers/import"
          className="btn-outline flex items-center gap-2 text-[13px]"
        >
          <Upload className="h-4 w-4" /> Import
        </Link>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 text-[13px]"
        >
          <Plus className="h-4 w-4" /> Add Customer
        </button>
      </div>

      <p className="text-[13px] text-stone-400">
        {filtered.length} customer{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-white py-16"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <Users className="mb-3 h-10 w-10 text-stone-300" />
          <p className="text-[14px] font-medium text-stone-600">
            {search ? 'No matching customers' : 'No customers yet'}
          </p>
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-2xl bg-white"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="text-[11px] uppercase text-stone-400">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Source</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="text-stone-600"
                  style={{ borderTop: '0.5px solid #e7e5e4' }}
                >
                  <td className="px-5 py-3 font-medium text-stone-800">
                    {c.name || '—'}
                  </td>
                  <td className="px-5 py-3">{c.phone || '—'}</td>
                  <td className="px-5 py-3">{c.email || '—'}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
                      {c.import_source}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        c.is_first_time
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {c.is_first_time ? 'New' : 'Returning'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 animate-fadeIn">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6"
            style={{ border: '0.5px solid #e7e5e4' }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[15px] font-medium text-stone-800">
                Add Customer
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-stone-400 hover:bg-stone-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                  style={{ border: '0.5px solid #e7e5e4' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                    style={{ border: '0.5px solid #e7e5e4' }}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                    style={{ border: '0.5px solid #e7e5e4' }}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                  style={{ border: '0.5px solid #e7e5e4' }}
                />
              </div>
              <label className="flex items-center gap-2 text-[13px] text-stone-600">
                <input
                  type="checkbox"
                  checked={form.is_first_time}
                  onChange={(e) => setForm({ ...form, is_first_time: e.target.checked })}
                  className="rounded"
                />
                First-time customer
              </label>
              <button type="submit" disabled={saving} className="btn-primary w-full">
                {saving ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  'Add Customer'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
