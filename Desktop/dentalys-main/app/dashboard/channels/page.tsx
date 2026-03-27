// app/dashboard/channels/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Send, BarChart2, CalendarCheck2 } from 'lucide-react'

export default async function ChannelAnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('business_id')
    .eq('id', user.id)
    .single()
  if (!profile?.business_id) redirect('/onboarding')

  const businessId = profile.business_id

  const [
    { count: totalConversations },
    { count: telegramConversations },
    { count: telegramBookings },
    { count: manualBookings },
    { count: activeThreads },
  ] = await Promise.all([
    supabase
      .from('conversation_threads')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId),
    supabase
      .from('conversation_threads')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('channel', 'telegram'),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('booking_channel', 'telegram'),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('booking_channel', 'manual'),
    supabase
      .from('conversation_threads')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('status', 'active'),
  ])

  const metrics = [
    {
      label: 'Total Conversations',
      value: totalConversations || 0,
      icon: BarChart2,
      color: 'text-teal-600 bg-teal-50',
    },
    {
      label: 'Active Threads',
      value: activeThreads || 0,
      icon: BarChart2,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Telegram Conversations',
      value: telegramConversations || 0,
      icon: Send,
      color: 'text-sky-600 bg-sky-50',
    },
    {
      label: 'Telegram Bookings',
      value: telegramBookings || 0,
      icon: CalendarCheck2,
      color: 'text-teal-600 bg-teal-50',
    },
  ]

  const totalBookingCount = (telegramBookings || 0) + (manualBookings || 0)
  const channels = [
    {
      name: 'Telegram',
      conversations: telegramConversations || 0,
      bookings: telegramBookings || 0,
      color: '#229ED9',
    },
    {
      name: 'Manual',
      conversations: 0,
      bookings: manualBookings || 0,
      color: '#a8a29e',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-2xl bg-white p-5"
            style={{ border: '0.5px solid #e7e5e4' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-stone-400">{m.label}</p>
                <p className="mt-1 text-2xl font-medium text-stone-800">
                  {m.value.toLocaleString()}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.color}`}
              >
                <m.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Channel Breakdown */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <h2 className="mb-5 text-[14px] font-medium text-stone-800">
          Channel Breakdown
        </h2>
        <div className="space-y-4">
          {channels.map((ch) => (
            <div key={ch.name}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] font-medium text-stone-700">
                  {ch.name}
                </span>
                <span className="text-[12px] text-stone-400">
                  {ch.bookings} bookings
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    backgroundColor: ch.color,
                    width:
                      totalBookingCount > 0
                        ? `${(ch.bookings / totalBookingCount) * 100}%`
                        : '0%',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings by channel table */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <h2 className="mb-4 text-[14px] font-medium text-stone-800">
          Bookings by Channel
        </h2>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="text-[11px] uppercase text-stone-400">
              <th className="pb-3 font-medium">Channel</th>
              <th className="pb-3 font-medium">Conversations</th>
              <th className="pb-3 font-medium">Bookings</th>
              <th className="pb-3 font-medium">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((ch) => (
              <tr
                key={ch.name}
                className="text-stone-600"
                style={{ borderTop: '0.5px solid #e7e5e4' }}
              >
                <td className="py-3 font-medium">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: ch.color }}
                    />
                    {ch.name}
                  </div>
                </td>
                <td className="py-3">{ch.conversations}</td>
                <td className="py-3">{ch.bookings}</td>
                <td className="py-3">
                  {ch.conversations > 0
                    ? `${Math.round(
                        (ch.bookings / ch.conversations) * 100
                      )}%`
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
