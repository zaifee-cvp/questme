// app/api/bookings/[id]/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteGoogleEvent } from '@/lib/google/calendar'

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('business_id')
    .eq('id', user.id)
    .single()
  if (!profile?.business_id) return NextResponse.json({ error: 'No business' }, { status: 404 })

  const db = createAdminClient()

  const { data: booking, error: fetchError } = await db
    .from('bookings')
    .select('id, business_id, status, google_event_id, google_calendar_id')
    .eq('id', params.id)
    .eq('business_id', profile.business_id)
    .single()

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
  if (booking.status === 'cancelled') {
    return NextResponse.json({ error: 'Already cancelled' }, { status: 400 })
  }

  // Cancel in DB
  const { error: updateError } = await db
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', booking.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Delete Google Calendar event if one exists
  if (booking.google_event_id) {
    try {
      const { data: calConn } = await db
        .from('calendar_connections')
        .select('*')
        .eq('business_id', profile.business_id)
        .eq('is_active', true)
        .maybeSingle()

      if (calConn) {
        await deleteGoogleEvent(calConn, booking.google_event_id)
      }
    } catch (err) {
      // Non-fatal — booking is already cancelled
      console.error('[cancel-booking] failed to delete Google Calendar event', {
        booking_id: booking.id,
        google_event_id: booking.google_event_id,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return NextResponse.json({ ok: true })
}
