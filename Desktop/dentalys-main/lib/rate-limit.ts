// lib/rate-limit.ts
// In-memory sliding-window rate limiter.
// Per-instance only — resets on cold starts. Sufficient for burst protection.
// For distributed rate limiting across Vercel instances, replace with Upstash Redis.

// ─── Fixed-window store (legacy, used by existing webhook handlers) ───────────
const fixedStore = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now()
  const entry = fixedStore.get(key)

  if (!entry || now > entry.resetAt) {
    fixedStore.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) {
    return false
  }

  entry.count++
  return true
}

// ─── True sliding-window store (new, used by API rate limiting) ───────────────
const slidingStore = new Map<string, number[]>()

/**
 * Sliding-window rate limiter.
 * Returns { allowed: true } or { allowed: false, retryAfterMs: number }.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now()
  const timestamps = slidingStore.get(key) ?? []

  // Evict timestamps outside the current window
  const cutoff = now - windowMs
  const recent = timestamps.filter((t) => t > cutoff)

  if (recent.length >= limit) {
    // Oldest timestamp tells us when the window will free a slot
    const retryAfterMs = recent[0] + windowMs - now
    slidingStore.set(key, recent)
    return { allowed: false, retryAfterMs: Math.max(0, retryAfterMs) }
  }

  recent.push(now)
  slidingStore.set(key, recent)
  return { allowed: true }
}
