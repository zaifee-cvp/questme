// app/api/cron/process-alerts/route.ts
// Triggered by Vercel Cron every 2 minutes.
// Processes queued booking alerts and outbound notifications.

import { NextRequest, NextResponse } from 'next/server'
import { processAlerts } from '@/workers/processAlerts'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await processAlerts()
    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    console.error('[cron/process-alerts] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
