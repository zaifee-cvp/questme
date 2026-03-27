// app/dashboard/calendar/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, CheckCircle2, ExternalLink, XCircle } from 'lucide-react'

export default async function CalendarPage() {
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

  const { data: connection } = await supabase
    .from('calendar_connections')
    .select('*')
    .eq('business_id', profile.business_id)
    .eq('is_active', true)
    .maybeSingle()

  const connected = !!connection

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Connection Status */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50">
            <Calendar className="h-6 w-6 text-sky-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-[15px] font-medium text-stone-800">
              Google Calendar
            </h2>
            <p className="text-[13px] text-stone-400">
              {connected
                ? `Connected — ${connection.google_account_email || connection.calendar_id}`
                : 'Not connected'}
            </p>
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${
              connected
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-stone-100 text-stone-500'
            }`}
          >
            {connected ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        {connected ? (
          <div className="space-y-4">
            <div>
              <p className="text-[13px] text-stone-600">
                Calendar ID:{' '}
                <code className="rounded bg-stone-100 px-1.5 py-0.5 text-[12px]">
                  {connection.calendar_id}
                </code>
              </p>
              {connection.google_account_email && (
                <p className="mt-1 text-[13px] text-stone-600">
                  Account: {connection.google_account_email}
                </p>
              )}
            </div>
            <form action="/api/google/disconnect" method="POST">
              <button
                type="submit"
                className="btn-ghost text-[13px] text-red-600 hover:text-red-700"
              >
                Disconnect Calendar
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-[13px] text-stone-500">
              Connect Google Calendar to automatically sync bookings and check
              availability.
            </p>
            <a
              href="/api/google/auth"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" /> Connect Google Calendar
            </a>
          </div>
        )}
      </div>

      {/* How it works */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <h3 className="mb-3 text-[14px] font-medium text-stone-800">
          How It Works
        </h3>
        <ul className="space-y-2 text-[13px] text-stone-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            AI checks your calendar for available time slots
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            New bookings are automatically added to your calendar
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            Cancellations sync back to your calendar
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            Calendar events from other sources are respected to prevent double-booking
          </li>
        </ul>
        <a
          href="https://calendar.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-[12px] text-sky-600 hover:text-sky-700 transition-colors"
        >
          Open Google Calendar <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
