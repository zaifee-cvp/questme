// app/dashboard/handoffs/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface HandoffWithCustomer {
  id: string
  reason: string | null
  status: 'pending' | 'acknowledged' | 'resolved'
  notes: string | null
  created_at: string
  thread_id: string
  customers: { name: string | null; phone: string | null }[] | null
}

export default function HandoffsPage() {
  const supabase = createClient()
  const [handoffs, setHandoffs] = useState<HandoffWithCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  const loadHandoffs = useCallback(async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id')
      .single()
    if (!profile?.business_id) return

    const { data } = await supabase
      .from('handoff_requests')
      .select('id, reason, status, notes, created_at, thread_id, customers(name, phone)')
      .eq('business_id', profile.business_id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) setHandoffs(data as HandoffWithCustomer[])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadHandoffs()
  }, [loadHandoffs])

  const updateStatus = async (
    id: string,
    status: 'acknowledged' | 'resolved'
  ) => {
    setActing(id)
    try {
      const res = await fetch(`/api/handoffs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) loadHandoffs()
    } finally {
      setActing(null)
    }
  }

  const statusConfig: Record<
    string,
    { icon: React.ElementType; color: string; bg: string }
  > = {
    pending: { icon: AlertCircle, color: 'text-amber-700', bg: 'bg-amber-50' },
    acknowledged: { icon: Clock, color: 'text-sky-700', bg: 'bg-sky-50' },
    resolved: {
      icon: CheckCircle2,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
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
      <p className="text-[13px] text-stone-400">
        {handoffs.length} handoff{handoffs.length !== 1 ? 's' : ''}
      </p>

      {handoffs.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-white py-16"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <UserCheck className="mb-3 h-10 w-10 text-stone-300" />
          <p className="text-[14px] font-medium text-stone-600">
            No handoffs yet
          </p>
          <p className="mt-1 text-[13px] text-stone-400">
            Handoffs appear when the AI cannot handle a customer request.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {handoffs.map((h) => {
            const cfg = statusConfig[h.status] || statusConfig.pending
            const StatusIcon = cfg.icon
            return (
              <div
                key={h.id}
                className="rounded-2xl bg-white p-5"
                style={{ border: '0.5px solid #e7e5e4' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-medium text-stone-800">
                        {h.customers?.[0]?.name || 'Unknown Customer'}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${cfg.bg} ${cfg.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {h.status}
                      </span>
                    </div>
                    {h.customers?.[0]?.phone && (
                      <p className="mt-0.5 text-[12px] text-stone-400">
                        {h.customers[0].phone}
                      </p>
                    )}
                    {h.reason && (
                      <p className="mt-2 text-[13px] text-stone-600">
                        {h.reason}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-stone-400">
                      {new Date(h.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {h.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(h.id, 'acknowledged')}
                        disabled={acting === h.id}
                        className="btn-outline text-[12px]"
                      >
                        {acting === h.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          'Acknowledge'
                        )}
                      </button>
                    )}
                    {(h.status === 'pending' ||
                      h.status === 'acknowledged') && (
                      <button
                        onClick={() => updateStatus(h.id, 'resolved')}
                        disabled={acting === h.id}
                        className="btn-primary text-[12px]"
                      >
                        {acting === h.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          'Resolve'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
