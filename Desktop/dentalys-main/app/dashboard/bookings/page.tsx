// app/dashboard/bookings/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CalendarCheck2 } from 'lucide-react'

export default async function BookingsPage() {
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

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('business_id', profile.business_id)
    .order('start_time', { ascending: false })
    .limit(50)

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-700',
    completed: 'bg-sky-50 text-sky-700',
    no_show: 'bg-stone-100 text-stone-600',
  }

  const channelColors: Record<string, string> = {
    telegram: 'bg-sky-50 text-sky-700',
    whatsapp: 'bg-emerald-50 text-emerald-700',
    manual: 'bg-stone-100 text-stone-600',
  }

  return (
    <div className="space-y-6">
      <p className="text-[13px] text-stone-400">
        {bookings?.length || 0} booking{(bookings?.length || 0) !== 1 ? 's' : ''} found
      </p>

      {!bookings || bookings.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl bg-white py-16"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <CalendarCheck2 className="mb-3 h-10 w-10 text-stone-300" />
          <p className="text-[14px] font-medium text-stone-600">No bookings yet</p>
          <p className="mt-1 text-[13px] text-stone-400">
            Bookings will appear here when customers book through your AI receptionist.
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
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Date / Time</th>
                <th className="px-5 py-3 font-medium">Duration</th>
                <th className="px-5 py-3 font-medium">Channel</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="text-stone-600"
                  style={{ borderTop: '0.5px solid #e7e5e4' }}
                >
                  <td className="px-5 py-3 font-medium text-stone-800">
                    {booking.service_name || 'N/A'}
                  </td>
                  <td className="px-5 py-3">
                    {new Date(booking.start_time).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-5 py-3">
                    {booking.service_duration ? `${booking.service_duration} min` : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        channelColors[booking.booking_channel] || 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {booking.booking_channel}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        statusColors[booking.status] || 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
