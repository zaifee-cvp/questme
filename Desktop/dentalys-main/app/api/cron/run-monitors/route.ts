// app/api/cron/run-monitors/route.ts
// Triggered by Vercel Cron every 5 minutes.
// Runs due reminder checks (replaces "monitors" concept in this booking SaaS).

import { NextRequest, NextResponse } from 'next/server'
import { runDueMonitors } from '@/workers/runDueMonitors'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await runDueMonitors()
    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    console.error('[cron/run-monitors] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
