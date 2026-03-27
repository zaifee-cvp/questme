// lib/ai/tools.ts
import { parseISO, addMinutes, startOfDay, addDays, format, isAfter } from 'date-fns'
import { fromZonedTime } from 'date-fns-tz'
import type { ChatCompletionTool } from 'openai/resources/chat/completions'
import type { AdminClient } from '@/lib/supabase/admin'
import type { ToolContext } from '@/types'
import { generateAvailableSlots } from '@/lib/booking/slots'
import { getGoogleBusyTimes, createGoogleEvent } from '@/lib/google/calendar'

export const AI_TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getServices',
      description: 'Get the list of active services offered by the clinic with prices and durations.',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getFaqAnswer',
      description: 'Search the clinic FAQ knowledge base for an answer to a patient question.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'The patient question to search for' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getActivePromotions',
      description: 'Get currently active promotions and discount offers.',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'checkFirstTimeCustomer',
      description: 'Check if the current patient is a first-time visitor to the clinic.',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getAvailableSlots',
      description: 'Get available appointment time slots for a specific service on a specific date. Returns { slots, closed }. If closed=true the clinic is not open that day — tell the patient the clinic is closed and suggest another day. If closed=false and slots is empty, the day is fully booked.',
      parameters: {
        type: 'object',
        properties: {
          service_id: { type: 'string', description: 'The exact id UUID from getServices — use the id field exactly as returned, never invent or guess a value' },
          date: { type: 'string', description: 'The date in YYYY-MM-DD format' },
        },
        required: ['service_id', 'date'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getNextAvailableSlot',
      description: 'Find the next available appointment slot starting from a given date. Call this automatically whenever getAvailableSlots returns closed=true or an empty slots array — never just say "we are closed" or "fully booked" without first finding and proposing the next open date and time.',
      parameters: {
        type: 'object',
        properties: {
          service_id: { type: 'string', description: 'The exact id UUID from getServices — use the id field exactly as returned, never invent or guess a value' },
          from_date: { type: 'string', description: 'Search forward starting from this date inclusive (YYYY-MM-DD)' },
        },
        required: ['service_id', 'from_date'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'createBooking',
      description: 'Create a confirmed appointment booking. Only call after ALL details are confirmed by the patient.',
      parameters: {
        type: 'object',
        properties: {
          service_id: { type: 'string', description: 'The exact id UUID from getServices — use the id field exactly as returned, never invent or guess a value' },
          start_time: { type: 'string', description: 'ISO 8601 UTC start time of the appointment' },
          patient_name: { type: 'string', description: 'Full name of the patient' },
          patient_phone: { type: 'string', description: 'Phone number of the patient' },
          patient_email: { type: 'string', description: 'Email of the patient (optional)' },
          notes: { type: 'string', description: 'Additional notes (optional)' },
        },
        required: ['service_id', 'start_time', 'patient_name', 'patient_phone'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'createHandoff',
      description: 'Escalate the conversation to a human staff member. Use when the patient requests a human, seems frustrated, or the query is outside AI capability.',
      parameters: {
        type: 'object',
        properties: {
          reason: { type: 'string', description: 'Reason for the handoff' },
        },
        required: ['reason'],
      },
    },
  },
]

// ============================================================
// Executor functions
// ============================================================

// Resolves a service by UUID first, then falls back to name/slug match.
// The AI sometimes hallucinates slugs like "botox-treatment" instead of UUIDs.
async function resolveService(
  db: AdminClient,
  businessId: string,
  serviceId: string
): Promise<{ id: string; duration_minutes: number } | null> {
  const { data: byId } = await db
    .from('services')
    .select('id, duration_minutes')
    .eq('id', serviceId)
    .eq('business_id', businessId)
    .maybeSingle()

  if (byId) return byId

  // Fallback: the AI sometimes passes slugs like "botox-treatment" or "botox-treatment-id"
  // Strip common non-service suffixes (-id, _id, -uuid), replace separators with spaces,
  // then take the first 3 words to avoid noise words breaking the match.
  const stripped = serviceId
    .replace(/[-_](id|uuid|service)$/i, '')  // remove trailing -id / _id / -uuid
    .replace(/[-_]/g, ' ')                   // dashes/underscores → spaces
    .trim()
  const keywords = stripped.split(' ').slice(0, 3).join(' ')

  const { data: byName } = await db
    .from('services')
    .select('id, duration_minutes')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .ilike('name', `%${keywords}%`)
    .limit(1)
    .maybeSingle()

  return byName || null
}

export async function executeGetServices(db: AdminClient, ctx: ToolContext) {
  const { data } = await db
    .from('services')
    .select('id, name, description, duration_minutes, price, currency')
    .eq('business_id', ctx.businessId)
    .eq('is_active', true)
    .order('sort_order')

  return { services: data || [] }
}

export async function executeGetFaqAnswer(
  db: AdminClient,
  ctx: ToolContext,
  query: string
) {
  // 1. Full-text search on question column
  const { data: ftsQ } = await db
    .from('faq_items')
    .select('question, answer')
    .eq('business_id', ctx.businessId)
    .eq('is_active', true)
    .textSearch('question', query, { type: 'websearch', config: 'english' })
    .limit(1)

  if (ftsQ && ftsQ.length > 0) {
    return { answer: ftsQ[0].answer, question: ftsQ[0].question, confidence: 'high' as const }
  }

  // 1b. Full-text search on answer column
  const { data: ftsA } = await db
    .from('faq_items')
    .select('question, answer')
    .eq('business_id', ctx.businessId)
    .eq('is_active', true)
    .textSearch('answer', query, { type: 'websearch', config: 'english' })
    .limit(1)

  if (ftsA && ftsA.length > 0) {
    return { answer: ftsA[0].answer, question: ftsA[0].question, confidence: 'high' as const }
  }

  // 2. Fallback: ilike — try each meaningful keyword independently and return
  //    the first row that matches ANY of them in question or answer
  const words = query
    .toLowerCase()
    .replace(/[?!.,]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !['what','does','have','with','this','that','your','from','they','will','when','where','which','about','into','more'].includes(w))

  if (words.length === 0) {
    return { answer: null, question: null, confidence: 'none' as const }
  }

  for (const word of words) {
    const { data: likeResults } = await db
      .from('faq_items')
      .select('question, answer')
      .eq('business_id', ctx.businessId)
      .eq('is_active', true)
      .or(`question.ilike.%${word}%,answer.ilike.%${word}%`)
      .limit(1)

    if (likeResults && likeResults.length > 0) {
      return {
        answer: likeResults[0].answer,
        question: likeResults[0].question,
        confidence: 'medium' as const,
      }
    }
  }

  return { answer: null, question: null, confidence: 'none' as const }
}

export async function executeGetActivePromotions(
  db: AdminClient,
  ctx: ToolContext
) {
  const now = new Date().toISOString()
  const { data } = await db
    .from('promotions')
    .select(
      'id, title, description, discount_type, discount_value, promo_code, first_time_only'
    )
    .eq('business_id', ctx.businessId)
    .eq('is_active', true)
    .or(`valid_from.is.null,valid_from.lte.${now}`)
    .or(`valid_until.is.null,valid_until.gte.${now}`)

  return { promotions: data || [] }
}

export async function executeCheckFirstTimeCustomer(
  db: AdminClient,
  ctx: ToolContext
) {
  const { data } = await db
    .from('customers')
    .select('is_first_time, name')
    .eq('business_id', ctx.businessId)
    .eq('telegram_chat_id', ctx.chatId)
    .maybeSingle()

  if (!data) {
    return { is_first_time: true, customer_name: null }
  }

  return { is_first_time: data.is_first_time, customer_name: data.name }
}

export async function executeGetAvailableSlots(
  db: AdminClient,
  ctx: ToolContext,
  serviceId: string,
  date: string
) {
  const service = await resolveService(db, ctx.businessId, serviceId)

  if (!service) return { slots: [], timezone: ctx.timezone, date }

  const [{ data: businessHours }, { data: business }] = await Promise.all([
    db.from('business_hours').select('*').eq('business_id', ctx.businessId),
    db.from('businesses').select('buffer_minutes').eq('id', ctx.businessId).single(),
  ])
  const bufferMinutes = business?.buffer_minutes ?? 0

  const dayStart = fromZonedTime(startOfDay(parseISO(date)), ctx.timezone)
  const dayEnd = fromZonedTime(startOfDay(addDays(parseISO(date), 1)), ctx.timezone)

  const { data: bookings } = await db
    .from('bookings')
    .select('*')
    .eq('business_id', ctx.businessId)
    .gte('start_time', dayStart.toISOString())
    .lt('start_time', dayEnd.toISOString())
    .neq('status', 'cancelled')

  let googleBusy: { start: string; end: string }[] = []
  const { data: calConn } = await db
    .from('calendar_connections')
    .select('*')
    .eq('business_id', ctx.businessId)
    .eq('is_active', true)
    .maybeSingle()

  if (calConn) {
    try {
      googleBusy = await getGoogleBusyTimes(
        calConn,
        dayStart.toISOString(),
        dayEnd.toISOString()
      )
    } catch (calendarError) {
      console.error('Google Calendar error:', calendarError)
      googleBusy = []
    }
  }

  const genResult = generateAvailableSlots({
    date,
    durationMinutes: service.duration_minutes,
    bufferMinutes,
    businessHours: businessHours || [],
    existingBookings: bookings || [],
    googleBusyTimes: googleBusy,
    timezone: ctx.timezone,
  })
  const { slots, closed } = genResult

  return { slots: slots.slice(0, 10), timezone: ctx.timezone, date, closed }
}

export async function executeCreateBooking(
  db: AdminClient,
  ctx: ToolContext,
  args: {
    service_id: string
    start_time: string
    patient_name: string
    patient_phone: string
    patient_email?: string
    notes?: string
  }
) {
  // 1. Fetch service (with slug fallback via resolveService)
  const resolvedRef = await resolveService(db, ctx.businessId, args.service_id)
  if (!resolvedRef) {
    return { success: false, message: 'Service not found' }
  }
  const { data: service } = await db
    .from('services')
    .select('*')
    .eq('id', resolvedRef.id)
    .eq('business_id', ctx.businessId)
    .single()

  if (!service) {
    return { success: false, message: 'Service not found' }
  }

  // 2. Calculate end time
  const startTime = parseISO(args.start_time)
  const endTime = addMinutes(startTime, service.duration_minutes)

  // 3. Double-booking check (belt + suspenders over DB constraint)
  const { data: conflicts } = await db
    .from('bookings')
    .select('id')
    .eq('business_id', ctx.businessId)
    .neq('status', 'cancelled')
    .lt('start_time', endTime.toISOString())
    .gt('end_time', args.start_time)
    .limit(1)

  if (conflicts && conflicts.length > 0) {
    return { success: false, message: 'This time slot is no longer available. Please choose another time.' }
  }

  // 4. Upsert customer
  const customerData: Record<string, unknown> = {
    business_id: ctx.businessId,
    name: args.patient_name,
    phone: args.patient_phone,
    email: args.patient_email || null,
  }

  customerData.telegram_chat_id = ctx.chatId

  let customerId: string | null = null

  const { data: existingCustomer } = await db
    .from('customers')
    .select('id')
    .eq('business_id', ctx.businessId)
    .eq('telegram_chat_id', ctx.chatId)
    .maybeSingle()

  if (existingCustomer) {
    customerId = existingCustomer.id
    await db
      .from('customers')
      .update({
        name: args.patient_name,
        phone: args.patient_phone,
        email: args.patient_email || undefined,
      })
      .eq('id', customerId)
  } else {
    const importSource = 'telegram' as const
    const { data: newCustomer } = await db
      .from('customers')
      .insert({
        ...customerData,
        import_source: importSource,
      } as never)
      .select('id')
      .single()
    customerId = newCustomer?.id || null
  }

  // 5. Insert booking
  const { data: booking, error: bookingError } = await db
    .from('bookings')
    .insert({
      business_id: ctx.businessId,
      customer_id: customerId,
      service_id: resolvedRef.id,
      service_name: service.name,
      service_duration: service.duration_minutes,
      start_time: args.start_time,
      end_time: endTime.toISOString(),
      status: 'confirmed',
      notes: args.notes || null,
      booking_channel: 'telegram' as const,
      source: 'telegram' as const,
    })
    .select('id')
    .single()

  if (bookingError || !booking) {
    return { success: false, message: 'Failed to create booking. The slot may no longer be available.' }
  }

  // 6. Google Calendar sync (non-fatal)
  try {
    const { data: calConn } = await db
      .from('calendar_connections')
      .select('*')
      .eq('business_id', ctx.businessId)
      .eq('is_active', true)
      .maybeSingle()

    if (calConn) {
      const { data: business } = await db
        .from('businesses')
        .select('name, timezone')
        .eq('id', ctx.businessId)
        .single()

      const eventId = await createGoogleEvent(calConn, {
        summary: `${service.name} - ${args.patient_name}`,
        description: `Patient: ${args.patient_name}\nPhone: ${args.patient_phone}${args.notes ? `\nNotes: ${args.notes}` : ''}`,
        start: {
          dateTime: args.start_time,
          timeZone: business?.timezone || 'UTC',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: business?.timezone || 'UTC',
        },
        attendees: args.patient_email
          ? [{ email: args.patient_email }]
          : undefined,
      })

      if (eventId) {
        await db
          .from('bookings')
          .update({
            google_event_id: eventId,
            google_calendar_id: calConn.calendar_id,
          })
          .eq('id', booking.id)
      }
    }
  } catch (err) {
    console.error('Google Calendar sync error (non-fatal):', err)
  }

  // 7. Link customer to conversation thread so name appears in Conversations list
  if (customerId && ctx.chatId) {
    await db
      .from('conversation_threads')
      .update({ customer_id: customerId })
      .eq('business_id', ctx.businessId)
      .eq('telegram_chat_id', ctx.chatId)
  }

  // 8. Update customer is_first_time
  if (customerId) {
    await db
      .from('customers')
      .update({ is_first_time: false })
      .eq('id', customerId)
  }

  return {
    success: true,
    booking_id: booking.id,
    message: 'Booking confirmed!',
    booking_details: {
      service_name: service.name,
      start_time: args.start_time,
      end_time: endTime.toISOString(),
      patient_name: args.patient_name,
    },
  }
}

export async function executeCreateHandoff(
  db: AdminClient,
  ctx: ToolContext,
  reason: string
) {
  // Find or create thread
  let { data: thread } = await db
    .from('conversation_threads')
    .select('id')
    .eq('business_id', ctx.businessId)
    .eq('channel', ctx.channel)
    .eq('telegram_chat_id', ctx.chatId)
    .maybeSingle()

  if (!thread) {
    const { data: newThread } = await db
      .from('conversation_threads')
      .insert({
        business_id: ctx.businessId,
        telegram_chat_id: ctx.chatId,
        channel: ctx.channel,
        status: 'handed_off',
      })
      .select('id')
      .single()
    thread = newThread
  } else {
    await db
      .from('conversation_threads')
      .update({ status: 'handed_off' })
      .eq('id', thread.id)
  }

  if (!thread) {
    return { success: false, message: 'Failed to create handoff' }
  }

  // Find customer
  const { data: customer } = await db
    .from('customers')
    .select('id')
    .eq('business_id', ctx.businessId)
    .eq('telegram_chat_id', ctx.chatId)
    .maybeSingle()

  // Insert handoff request
  await db.from('handoff_requests').insert({
    business_id: ctx.businessId,
    thread_id: thread.id,
    customer_id: customer?.id || null,
    reason,
    status: 'pending',
  })

  return {
    success: true,
    handoff_id: thread.id,
    message: 'Your conversation has been escalated to our team. They will get back to you shortly.',
  }
}

export async function executeGetNextAvailableSlot(
  db: AdminClient,
  ctx: ToolContext,
  serviceId: string,
  fromDate: string
) {
  const service = await resolveService(db, ctx.businessId, serviceId)

  console.log('[dbg-next] serviceId:', serviceId, 'businessId:', ctx.businessId, 'found:', !!service)

  if (!service) return { found: false, timezone: ctx.timezone }

  const [{ data: businessHours }, { data: business }] = await Promise.all([
    db.from('business_hours').select('*').eq('business_id', ctx.businessId),
    db.from('businesses').select('buffer_minutes').eq('id', ctx.businessId).single(),
  ])
  const bufferMinutes = business?.buffer_minutes ?? 0

  console.log('[dbg-next] businessHours count:', (businessHours || []).length, 'duration:', service.duration_minutes, 'buffer:', bufferMinutes)

  const { data: calConn } = await db
    .from('calendar_connections')
    .select('*')
    .eq('business_id', ctx.businessId)
    .eq('is_active', true)
    .maybeSingle()

  console.log('[dbg-next] calConn active:', !!calConn)

  // Always start from at least tomorrow — never today or past dates
  const tomorrow = startOfDay(addDays(new Date(), 1))
  const requested = startOfDay(parseISO(fromDate))
  try {
    let current = isAfter(requested, tomorrow) ? requested : tomorrow
    console.log('[dbg-next] fromDate:', fromDate, '→ starting search from:', format(current, 'yyyy-MM-dd'))
    for (let i = 0; i < 60; i++) {
      const dateStr = format(current, 'yyyy-MM-dd')
      const dayStart = fromZonedTime(startOfDay(current), ctx.timezone)
      const dayEnd = fromZonedTime(startOfDay(addDays(current, 1)), ctx.timezone)

      const { data: bookings } = await db
        .from('bookings')
        .select('*')
        .eq('business_id', ctx.businessId)
        .gte('start_time', dayStart.toISOString())
        .lt('start_time', dayEnd.toISOString())
        .neq('status', 'cancelled')

      let googleBusy: { start: string; end: string }[] = []
      if (calConn) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          googleBusy = await getGoogleBusyTimes(calConn!, dayStart.toISOString(), dayEnd.toISOString())
        } catch {
          googleBusy = []
        }
      }

      const result = generateAvailableSlots({
        date: dateStr,
        durationMinutes: service.duration_minutes,
        bufferMinutes,
        businessHours: businessHours || [],
        existingBookings: bookings || [],
        googleBusyTimes: googleBusy,
        timezone: ctx.timezone,
      })

      const { slots, closed } = result
      console.log(`[dbg-next] day ${dateStr}: closed=${closed}, slots=${slots.length}, bookings=${(bookings||[]).length}, googleBusy=${googleBusy.length}`)

      if (!closed && slots.length > 0) {
        console.log('[dbg-next] found available day:', dateStr)
        return { found: true, date: dateStr, slots: slots.slice(0, 5), timezone: ctx.timezone }
      }

      current = addDays(current, 1)
    }
  } catch (err) {
    console.error('[dbg-next] error:', String(err))
    return { found: false, timezone: ctx.timezone }
  }

  console.log('[dbg-next] exhausted 60 days, no slots found')
  return { found: false, timezone: ctx.timezone }
}

export async function executeTool(
  db: AdminClient,
  ctx: ToolContext,
  toolName: string,
  toolArgs: Record<string, string>
): Promise<unknown> {
  switch (toolName) {
    case 'getServices':
      return executeGetServices(db, ctx)
    case 'getFaqAnswer':
      return executeGetFaqAnswer(db, ctx, toolArgs.query)
    case 'getActivePromotions':
      return executeGetActivePromotions(db, ctx)
    case 'checkFirstTimeCustomer':
      return executeCheckFirstTimeCustomer(db, ctx)
    case 'getAvailableSlots':
      return executeGetAvailableSlots(db, ctx, toolArgs.service_id, toolArgs.date)
    case 'getNextAvailableSlot':
      return executeGetNextAvailableSlot(db, ctx, toolArgs.service_id, toolArgs.from_date)
    case 'createBooking':
      return executeCreateBooking(db, ctx, toolArgs as never)
    case 'createHandoff':
      return executeCreateHandoff(db, ctx, toolArgs.reason)
    default:
      return { error: `Unknown tool: ${toolName}` }
  }
}
