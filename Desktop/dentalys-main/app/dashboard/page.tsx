// app/dashboard/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  CalendarCheck2,
  Users,
  UserCheck,
  TrendingUp,
  ArrowRight,
  Send,
} from 'lucide-react'
import OnboardingBanner from '@/components/dashboard/OnboardingBanner'

export default async function DashboardPage() {
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

  const { data: business } = await supabase
    .from('businesses')
    .select('telegram_bot_token')
    .eq('id', businessId)
    .single()

  const { count: serviceCount } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', businessId)
  const hasService = (serviceCount ?? 0) > 0

  const hasChannel = !!business?.telegram_bot_token

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    { count: totalBookings },
    { count: bookingsThisMonth },
    { count: totalCustomers },
    { count: newCustomersThisMonth },
    { count: pendingHandoffs },
    { data: upcomingBookings },
  ] = await Promise.all([
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .gte('created_at', startOfMonth),
    supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId),
    supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .gte('created_at', startOfMonth),
    supabase
      .from('handoff_requests')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('status', 'pending'),
    supabase
      .from('bookings')
      .select('id, service_name, start_time, end_time, status, booking_channel')
      .eq('business_id', businessId)
      .gte('start_time', now.toISOString())
      .order('start_time', { ascending: true })
      .limit(5),
  ])

  const stats = [
    {
      label: 'Total Bookings',
      value: totalBookings || 0,
      icon: CalendarCheck2,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Bookings This Month',
      value: bookingsThisMonth || 0,
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Total Customers',
      value: totalCustomers || 0,
      icon: Users,
      color: 'text-sky-600 bg-sky-50',
    },
    {
      label: 'Pending Handoffs',
      value: pendingHandoffs || 0,
      icon: UserCheck,
      color: 'text-rose-600 bg-rose-50',
    },
  ]

  const quickActions = [
    { label: 'Connect Telegram', href: '/dashboard/telegram', icon: Send },
    { label: 'Add Services', href: '/dashboard/services', icon: CalendarCheck2 },
    { label: 'View Customers', href: '/dashboard/customers', icon: Users },
    { label: 'View Bookings', href: '/dashboard/bookings', icon: CalendarCheck2 },
  ]

  return (
    <div className="space-y-6">
      <OnboardingBanner hasService={hasService} hasChannel={hasChannel} />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white p-5"
            style={{ border: '0.5px solid #e7e5e4' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-stone-400">{stat.label}</p>
                <p className="mt-1 text-2xl font-medium text-stone-800">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div
        className="rounded-2xl bg-white p-5"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <h2 className="mb-4 text-[14px] font-medium text-stone-800">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3 text-[13px] text-stone-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              style={{ border: '0.5px solid #e7e5e4' }}
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* New Customers This Month */}
      <div
        className="rounded-2xl bg-white p-5"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-medium text-stone-800">
            New Customers This Month
          </h2>
          <span className="text-2xl font-medium text-stone-800">
            {newCustomersThisMonth || 0}
          </span>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div
        className="rounded-2xl bg-white p-5"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[14px] font-medium text-stone-800">
            Upcoming Bookings
          </h2>
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-1 text-[12px] text-amber-600 hover:text-amber-700 transition-colors"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {upcomingBookings && upcomingBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="text-[11px] uppercase text-stone-400">
                  <th className="pb-3 font-medium">Service</th>
                  <th className="pb-3 font-medium">Date / Time</th>
                  <th className="pb-3 font-medium">Channel</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="text-stone-600"
                    style={{ borderTop: '0.5px solid #e7e5e4' }}
                  >
                    <td className="py-3">
                      {booking.service_name || 'N/A'}
                    </td>
                    <td className="py-3">
                      {new Date(booking.start_time).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          booking.booking_channel === 'whatsapp'
                            ? 'bg-emerald-50 text-emerald-700'
                            : booking.booking_channel === 'telegram'
                            ? 'bg-sky-50 text-sky-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {booking.booking_channel}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : booking.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : booking.status === 'cancelled'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-stone-100 text-stone-600'
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
        ) : (
          <p className="text-center text-[13px] text-stone-400 py-8">
            No upcoming bookings
          </p>
        )}
      </div>
    </div>
  )
}
