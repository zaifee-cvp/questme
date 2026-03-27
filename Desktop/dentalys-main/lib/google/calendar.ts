// lib/google/calendar.ts
import { google } from 'googleapis'
import type { Credentials } from 'google-auth-library'
import { createAdminClient } from '@/lib/supabase/admin'
import type { CalendarConnection, GoogleBusyTime, GoogleCalendarEvent } from '@/types'

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/userinfo.email',
]

export function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  )
}

export function getAuthUrl(businessId: string): string {
  const client = getOAuthClient()
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    state: businessId,
  })
}

export async function exchangeCodeForTokens(code: string): Promise<Credentials> {
  const client = getOAuthClient()
  const { tokens } = await client.getToken(code)
  return tokens
}

export async function getAuthedClient(connection: CalendarConnection) {
  const client = getOAuthClient()
  client.setCredentials({
    access_token: connection.access_token,
    refresh_token: connection.refresh_token,
  })

  const expiry = connection.token_expiry
    ? new Date(connection.token_expiry).getTime()
    : 0
  const fiveMinFromNow = Date.now() + 5 * 60 * 1000

  if (expiry < fiveMinFromNow && connection.refresh_token) {
    const { credentials } = await client.refreshAccessToken()
    client.setCredentials(credentials)

    const db = createAdminClient()
    const tokenUpdate: Record<string, string | null> = {
      access_token: credentials.access_token ?? null,
      token_expiry: credentials.expiry_date
        ? new Date(credentials.expiry_date).toISOString()
        : null,
    }
    // Persist rotated refresh_token if Google issued a new one
    if (credentials.refresh_token) {
      tokenUpdate.refresh_token = credentials.refresh_token
    }
    await db
      .from('calendar_connections')
      .update(tokenUpdate)
      .eq('id', connection.id)
  }

  return client
}

export async function getGoogleBusyTimes(
  connection: CalendarConnection,
  timeMin: string,
  timeMax: string
): Promise<GoogleBusyTime[]> {
  try {
    const auth = await getAuthedClient(connection)
    const calendar = google.calendar({ version: 'v3', auth })
    const res = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        items: [{ id: connection.calendar_id || 'primary' }],
      },
    })
    const busy = res.data.calendars?.[connection.calendar_id || 'primary']?.busy
    return (busy || []).map((b) => ({
      start: b.start!,
      end: b.end!,
    }))
  } catch (err) {
    console.error('Google freebusy error:', err)
    return []
  }
}

export async function createGoogleEvent(
  connection: CalendarConnection,
  event: GoogleCalendarEvent
): Promise<string | null> {
  try {
    const auth = await getAuthedClient(connection)
    const calendar = google.calendar({ version: 'v3', auth })
    const res = await calendar.events.insert({
      calendarId: connection.calendar_id || 'primary',
      requestBody: event,
    })
    return res.data.id || null
  } catch (err) {
    console.error('Google create event error:', err)
    return null
  }
}

export async function deleteGoogleEvent(
  connection: CalendarConnection,
  eventId: string
): Promise<void> {
  try {
    const auth = await getAuthedClient(connection)
    const calendar = google.calendar({ version: 'v3', auth })
    await calendar.events.delete({
      calendarId: connection.calendar_id || 'primary',
      eventId,
    })
  } catch (err) {
    console.error('[google/calendar] deleteGoogleEvent failed', {
      event_id: eventId,
      calendar_id: connection.calendar_id,
      connection_id: connection.id,
      error: err instanceof Error ? err.message : String(err),
    })
    throw err
  }
}

export async function getGoogleAccountEmail(
  accessToken: string
): Promise<string | null> {
  try {
    const client = getOAuthClient()
    client.setCredentials({ access_token: accessToken })
    const oauth2 = google.oauth2({ version: 'v2', auth: client })
    const res = await oauth2.userinfo.get()
    return res.data.email || null
  } catch {
    return null
  }
}
