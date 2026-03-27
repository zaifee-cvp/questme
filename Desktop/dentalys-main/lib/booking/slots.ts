// lib/booking/slots.ts
import {
  addMinutes,
  format,
  parseISO,
  areIntervalsOverlapping,
  startOfDay,
  addDays,
  getDay,
  isAfter,
} from 'date-fns'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import type { BusinessHour, Booking, GoogleBusyTime, TimeSlot } from '@/types'

interface GenerateSlotsParams {
  date: string
  durationMinutes: number
  bufferMinutes?: number
  businessHours: BusinessHour[]
  existingBookings: Booking[]
  googleBusyTimes: GoogleBusyTime[]
  timezone: string
}

export function generateAvailableSlots({
  date,
  durationMinutes,
  bufferMinutes = 0,
  businessHours,
  existingBookings,
  googleBusyTimes,
  timezone,
}: GenerateSlotsParams): { slots: TimeSlot[]; closed: boolean } {
  const dateInTz = toZonedTime(parseISO(date), timezone)
  const dayOfWeek = getDay(dateInTz)
  const hours = businessHours.find((h) => h.day_of_week === dayOfWeek)
  if (!hours || !hours.is_open) return { slots: [], closed: true }

  const [openH, openM] = hours.open_time.split(':').map(Number)
  const [closeH, closeM] = hours.close_time.split(':').map(Number)

  const openDateTime = fromZonedTime(
    new Date(
      dateInTz.getFullYear(),
      dateInTz.getMonth(),
      dateInTz.getDate(),
      openH,
      openM,
      0
    ),
    timezone
  )
  const closeDateTime = fromZonedTime(
    new Date(
      dateInTz.getFullYear(),
      dateInTz.getMonth(),
      dateInTz.getDate(),
      closeH,
      closeM,
      0
    ),
    timezone
  )

  const now = new Date()
  const earliestStart = addMinutes(now, 15)
  const activeBookings = existingBookings.filter(
    (b) => b.status !== 'cancelled'
  )
  // effectiveDuration includes buffer for conflict detection only.
  // The actual booking end_time is still start + durationMinutes.
  const effectiveDuration = durationMinutes + bufferMinutes
  const slots: TimeSlot[] = []
  let slotStart = openDateTime
  while (slots.length < 10) {
    const slotEnd = addMinutes(slotStart, durationMinutes)
    const conflictEnd = addMinutes(slotStart, effectiveDuration)
    if (isAfter(conflictEnd, closeDateTime)) break
    if (isAfter(earliestStart, slotStart)) {
      slotStart = addMinutes(slotStart, 30)
      continue
    }
    const conflictInterval = { start: slotStart, end: conflictEnd }
    const hasBookingConflict = activeBookings.some((b) =>
      areIntervalsOverlapping(conflictInterval, {
        start: new Date(b.start_time),
        end: new Date(b.end_time),
      })
    )
    const hasGoogleConflict = googleBusyTimes.some((bt) =>
      areIntervalsOverlapping(conflictInterval, {
        start: new Date(bt.start),
        end: new Date(bt.end),
      })
    )
    if (!hasBookingConflict && !hasGoogleConflict) {
      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
      })
    }
    slotStart = addMinutes(slotStart, 30)
  }
  return { slots, closed: false }
}

export function formatSlotForDisplay(
  slot: TimeSlot,
  timezone: string
): string {
  const start = toZonedTime(parseISO(slot.start), timezone)
  const end = toZonedTime(parseISO(slot.end), timezone)
  return `${format(start, 'h:mm a')} – ${format(end, 'h:mm a')}`
}

export function getNextBusinessDays(
  businessHours: BusinessHour[],
  timezone: string,
  count = 7
): string[] {
  const days: string[] = []
  const now = toZonedTime(new Date(), timezone)
  let current = startOfDay(now)

  let checked = 0
  while (days.length < count && checked < 30) {
    const dow = getDay(current)
    const hours = businessHours.find((h) => h.day_of_week === dow)
    if (hours && hours.is_open) {
      days.push(format(current, 'yyyy-MM-dd'))
    }
    current = addDays(current, 1)
    checked++
  }

  return days
}
