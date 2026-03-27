// workers/runDueMonitors.ts
// Stub: delegates to the scheduled reminder logic.
// TODO: Extract reminder dispatch from app/api/cron/reminders/route.ts into a
// reusable function and call it here so this worker and the cron share one code path.

export async function runDueMonitors(): Promise<{ processed: number }> {
  console.log('[workers/runDueMonitors] stub — implement reminder dispatch here')
  return { processed: 0 }
}
