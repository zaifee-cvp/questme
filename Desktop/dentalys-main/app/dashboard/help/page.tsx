// app/dashboard/help/page.tsx
import Link from 'next/link'
import { Download, Info, Calendar, Clock, Globe, AlertTriangle } from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-[18px] font-medium text-stone-800">Help &amp; Documentation</h1>
        <p className="mt-1 text-[13px] text-stone-400">
          Learn how to configure your AI bot&apos;s availability and calendar integration.
        </p>
      </div>

      {/* Card 1 — Overview */}
      <div
        className="rounded-2xl bg-sky-50 p-6"
        style={{ border: '0.5px solid #bae6fd' }}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100">
            <Info className="h-4 w-4 text-sky-600" />
          </div>
          <div>
            <h2 className="text-[14px] font-medium text-sky-900">
              How your AI bot determines availability
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-sky-800">
              Two sources control when the bot can offer appointment slots:
            </p>
            <ol className="mt-3 space-y-2 text-[13px] text-sky-800">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-200 text-[11px] font-medium text-sky-700">1</span>
                <span><strong>Dentalys Business Hours</strong> — your weekly open/close schedule set in the Business Hours page. This defines which days and hours the bot can book.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-200 text-[11px] font-medium text-sky-700">2</span>
                <span><strong>Google Calendar Busy events</strong> — specific dates or recurring closures you mark as Busy in Google Calendar. These override your regular hours.</span>
              </li>
            </ol>
            <p className="mt-3 text-[13px] text-sky-700">
              Both must be configured correctly. If a day is not marked Busy in Google Calendar, the bot will treat it as open according to your weekly schedule.
            </p>
          </div>
        </div>
      </div>

      {/* Card 2 — Weekly Schedule */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <h2 className="text-[14px] font-medium text-stone-800">
            Step 1 — Set your weekly hours in Dentalys
          </h2>
        </div>
        <ol className="space-y-2.5 text-[13px] text-stone-600">
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">1</span>
            <span>Go to <Link href="/dashboard/business-hours" className="text-amber-600 hover:underline">Business Hours</Link> in the sidebar.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">2</span>
            <span>Toggle each day on or off using the checkbox next to the day name.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">3</span>
            <span>Set the opening and closing time for each open day.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">4</span>
            <span>Enable <strong>Close on public holidays</strong> if you want the bot to automatically block days marked as holidays in your connected Google Calendar.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">5</span>
            <span>Click <strong>Save Hours</strong>.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">6</span>
            <span>These hours apply every week. For one-off closures, use Google Calendar (see Step 2).</span>
          </li>
        </ol>
      </div>

      {/* Card 3 — Blocking Dates */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
            <Calendar className="h-4 w-4 text-amber-600" />
          </div>
          <h2 className="text-[14px] font-medium text-stone-800">
            Step 2 — Block specific dates in Google Calendar
          </h2>
        </div>

        {/* Important rule */}
        <div
          className="mb-5 flex items-start gap-3 rounded-xl p-4"
          style={{ border: '0.5px solid #fca5a5', backgroundColor: '#fff5f5' }}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-[13px] text-red-700">
            <strong>IMPORTANT:</strong> You must set the event status to <strong>Busy</strong>. If left as <strong>Free</strong>, the bot will ignore the event and still offer slots on that day.
          </p>
        </div>

        <p className="mb-3 text-[13px] font-medium text-stone-700">To block a single date:</p>
        <ol className="mb-5 space-y-2 text-[13px] text-stone-600">
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">1</span>
            <span>Open Google Calendar and click the date you want to block.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">2</span>
            <span>Create an all-day event (e.g. &quot;Clinic Closed&quot;).</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">3</span>
            <span>In the event details, find the status dropdown and change it from <strong>Free</strong> to <strong>Busy</strong>.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">4</span>
            <span>Save the event. The bot will now show that date as unavailable.</span>
          </li>
        </ol>

        <p className="mb-3 text-[13px] font-medium text-stone-700">To block a recurring weekly closure (e.g. every Sunday):</p>
        <ol className="space-y-2 text-[13px] text-stone-600">
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">1</span>
            <span>Create an all-day event on the first occurrence (e.g. next Sunday).</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">2</span>
            <span>Set <strong>Repeat</strong> to &quot;Every week&quot; on the relevant day.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">3</span>
            <span>Set the event status to <strong>Busy</strong>.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">4</span>
            <span>Save. The bot will treat every matching day as closed automatically.</span>
          </li>
        </ol>
      </div>

      {/* Card 4 — Public Holidays */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
            <Globe className="h-4 w-4 text-amber-600" />
          </div>
          <h2 className="text-[14px] font-medium text-stone-800">
            Step 3 — Subscribe to public holidays in Google Calendar
          </h2>
        </div>
        <ol className="space-y-2.5 text-[13px] text-stone-600">
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">1</span>
            <span>Open Google Calendar on desktop and click the <strong>+</strong> next to &quot;Other calendars&quot; in the left sidebar.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">2</span>
            <span>Select <strong>Browse calendars of interest</strong>.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">3</span>
            <span>Under <strong>Holidays</strong>, find your country (e.g. &quot;Holidays in Singapore&quot;) and click the toggle to subscribe.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">4</span>
            <span>Return to Dentalys, go to <Link href="/dashboard/business-hours" className="text-amber-600 hover:underline">Business Hours</Link>, and enable <strong>Close on public holidays</strong>.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-[11px] font-medium text-stone-600">5</span>
            <span>The bot will now automatically skip any day that appears as a holiday event in your Google Calendar.</span>
          </li>
        </ol>
      </div>

      {/* Card 5 — Troubleshooting */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <h2 className="mb-4 text-[14px] font-medium text-stone-800">Troubleshooting</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr>
                <th className="pb-3 pr-4 text-[11px] font-medium uppercase tracking-wider text-stone-400">Problem</th>
                <th className="pb-3 pr-4 text-[11px] font-medium uppercase tracking-wider text-stone-400">Cause</th>
                <th className="pb-3 text-[11px] font-medium uppercase tracking-wider text-stone-400">Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr className="text-stone-600">
                <td className="py-3 pr-4 align-top">Bot offers slots on a day I closed in Google Calendar</td>
                <td className="py-3 pr-4 align-top">Event status is set to Free, not Busy</td>
                <td className="py-3 align-top">Edit the event and change status to <strong>Busy</strong></td>
              </tr>
              <tr className="text-stone-600">
                <td className="py-3 pr-4 align-top">Public holidays are not being blocked</td>
                <td className="py-3 pr-4 align-top">Holiday calendar not subscribed, or &quot;Close on public holidays&quot; is off</td>
                <td className="py-3 align-top">Subscribe to holiday calendar in Google Calendar and enable the checkbox in Business Hours</td>
              </tr>
              <tr className="text-stone-600">
                <td className="py-3 pr-4 align-top">Weekly recurring closure not working</td>
                <td className="py-3 pr-4 align-top">Recurring event not marked as Busy, or created on wrong day</td>
                <td className="py-3 align-top">Re-create the recurring event and set status to <strong>Busy</strong></td>
              </tr>
              <tr className="text-stone-600">
                <td className="py-3 pr-4 align-top">Bot ignores all blocked dates</td>
                <td className="py-3 pr-4 align-top">Google Calendar is not connected or was disconnected</td>
                <td className="py-3 align-top">Go to <Link href="/dashboard/calendar" className="text-amber-600 hover:underline">Google Calendar</Link> and reconnect your account</td>
              </tr>
              <tr className="text-stone-600">
                <td className="py-3 pr-4 align-top">Bot offers appointments outside business hours</td>
                <td className="py-3 pr-4 align-top">Business Hours not saved, or all days toggled off</td>
                <td className="py-3 align-top">Go to <Link href="/dashboard/business-hours" className="text-amber-600 hover:underline">Business Hours</Link>, enable the correct days and click Save Hours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 6 — Downloads */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <h2 className="mb-1 text-[14px] font-medium text-stone-800">Download guides</h2>
        <p className="mb-5 text-[13px] text-stone-400">
          Step-by-step setup guides as Word documents.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/docs/google-calendar-setup-guide.docx"
            download="Dentalys_Google_Calendar_Setup_Guide.docx"
            className="inline-flex items-center gap-2 rounded-lg bg-stone-800 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-stone-700"
          >
            <Download className="h-4 w-4" />
            Download Google Calendar Setup Guide
          </a>
          <a
            href="/docs/telegram-setup-guide.docx"
            download="Dentalys_Telegram_Setup_Guide.docx"
            className="inline-flex items-center gap-2 rounded-lg bg-stone-800 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-stone-700"
          >
            <Download className="h-4 w-4" />
            Download Telegram Setup Guide
          </a>
        </div>
      </div>
    </div>
  )
}
