// app/dashboard/business-hours/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle2 } from 'lucide-react'

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

interface HourRow {
  id?: string
  day_of_week: number
  open_time: string
  close_time: string
  is_open: boolean
  respect_public_holidays: boolean
}

export default function BusinessHoursPage() {
  const supabase = createClient()
  const [hours, setHours] = useState<HourRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [businessId, setBusinessId] = useState<string>('')
  const [respectHolidays, setRespectHolidays] = useState(false)
  const [bufferMinutes, setBufferMinutes] = useState(0)

  const loadHours = useCallback(async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id')
      .single()
    if (!profile?.business_id) return
    setBusinessId(profile.business_id)

    const { data: business } = await supabase
      .from('businesses')
      .select('buffer_minutes')
      .eq('id', profile.business_id)
      .single()
    if (business) setBufferMinutes(business.buffer_minutes ?? 0)

    const { data } = await supabase
      .from('business_hours')
      .select('*')
      .eq('business_id', profile.business_id)
      .order('day_of_week', { ascending: true })

    if (data && data.length > 0) {
      setHours(data)
      setRespectHolidays(data[0]?.respect_public_holidays ?? false)
    } else {
      // Default hours
      setHours(
        DAYS.map((_, i) => ({
          day_of_week: i,
          open_time: '09:00',
          close_time: '18:00',
          is_open: i >= 1 && i <= 5, // Mon-Fri open
          respect_public_holidays: false,
        }))
      )
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadHours()
  }, [loadHours])

  const updateRow = (index: number, field: keyof HourRow, value: string | boolean) => {
    setHours((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    )
    setSaved(false)
  }

  const handleSave = async () => {
    if (!businessId) return
    setSaving(true)

    // Delete existing and re-insert business hours
    await supabase
      .from('business_hours')
      .delete()
      .eq('business_id', businessId)

    const inserts = hours.map((row) => ({
      business_id: businessId,
      day_of_week: row.day_of_week,
      open_time: row.open_time,
      close_time: row.close_time,
      is_open: row.is_open,
      respect_public_holidays: respectHolidays,
    }))

    await Promise.all([
      supabase.from('business_hours').insert(inserts),
      supabase.from('businesses').update({ buffer_minutes: bufferMinutes }).eq('id', businessId),
    ])

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
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
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[14px] font-medium text-stone-800">Set your operating hours</h2>
          <Link
            href="/dashboard/help"
            className="text-[12px] text-amber-600 hover:text-amber-700 hover:underline"
          >
            Need help setting up?
          </Link>
        </div>
        <div className="space-y-3">
          {hours.map((row, i) => (
            <div
              key={row.day_of_week}
              className="flex items-center gap-4"
            >
              <label className="flex w-28 items-center gap-2 text-[13px] text-stone-600">
                <input
                  type="checkbox"
                  checked={row.is_open}
                  onChange={(e) => updateRow(i, 'is_open', e.target.checked)}
                  className="rounded"
                />
                {DAYS[row.day_of_week]}
              </label>
              {row.is_open ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="time"
                    value={row.open_time}
                    onChange={(e) => updateRow(i, 'open_time', e.target.value)}
                    className="rounded-lg bg-white px-3 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                    style={{ border: '0.5px solid #e7e5e4' }}
                  />
                  <span className="text-[12px] text-stone-400">to</span>
                  <input
                    type="time"
                    value={row.close_time}
                    onChange={(e) => updateRow(i, 'close_time', e.target.value)}
                    className="rounded-lg bg-white px-3 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                    style={{ border: '0.5px solid #e7e5e4' }}
                  />
                </div>
              ) : (
                <span className="text-[12px] text-stone-400">Closed</span>
              )}
            </div>
          ))}
        </div>

        <div
          className="mt-5 flex items-start gap-3 rounded-xl p-4"
          style={{ border: '0.5px solid #e7e5e4', backgroundColor: '#fafaf9' }}
        >
          <input
            type="checkbox"
            id="respect_holidays"
            checked={respectHolidays}
            onChange={(e) => { setRespectHolidays(e.target.checked); setSaved(false) }}
            className="mt-0.5 rounded"
          />
          <label htmlFor="respect_holidays" className="cursor-pointer">
            <p className="text-[13px] font-medium text-stone-700">Close on public holidays</p>
            <p className="mt-0.5 text-[12px] text-stone-400">
              The bot will automatically skip any date marked as busy or blocked in your connected Google Calendar, including public holidays you have added there.
            </p>
          </label>
        </div>

        <div
          className="mt-3 flex items-center justify-between rounded-xl p-4"
          style={{ border: '0.5px solid #e7e5e4', backgroundColor: '#fafaf9' }}
        >
          <div>
            <p className="text-[13px] font-medium text-stone-700">Buffer time between appointments</p>
            <p className="mt-0.5 text-[12px] text-stone-400">
              Add a gap after each booking for preparation and cleanup
            </p>
          </div>
          <select
            value={bufferMinutes}
            onChange={(e) => { setBufferMinutes(Number(e.target.value)); setSaved(false) }}
            className="rounded-lg bg-white px-3 py-1.5 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
            style={{ border: '0.5px solid #e7e5e4' }}
          >
            <option value={0}>No buffer</option>
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={20}>20 minutes</option>
            <option value={30}>30 minutes</option>
          </select>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 text-[13px]"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Save Hours'
            )}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-[12px] text-emerald-600 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
