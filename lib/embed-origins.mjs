/**
 * The single definition of the app's CSP, shared by next.config.mjs (static
 * headers, applied at build time) and middleware.ts (the per-bot frame-ancestors
 * value, which can only be known per request).
 *
 * This file must stay .mjs. Next 14 loads next.config at config time and cannot
 * load TypeScript there, so a .ts module could not be imported by both.
 *
 * The point of sharing is that the two callers cannot drift: a directive added
 * here reaches the app headers and the chat page's headers in the same commit.
 */

/** Everything except frame-ancestors, which is the only per-caller directive. */
export const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: *.supabase.co lh3.googleusercontent.com cdnjs.cloudflare.com",
  "connect-src 'self' *.supabase.co wss://*.supabase.co accounts.google.com",
  "font-src 'self'",
  "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
]

/** @param {string} frameAncestors */
export const csp = (frameAncestors) =>
  [...CSP_DIRECTIVES, `frame-ancestors ${frameAncestors}`].join('; ')

/**
 * A bare origin: scheme + host + optional port. No path, no query, no wildcard,
 * no trailing slash — frame-ancestors takes origins, and a browser that meets a
 * malformed source list discards the WHOLE directive, which fails open. Dropping
 * a bad entry silently is therefore safer than passing it through.
 */
const ORIGIN = /^https?:\/\/[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*(:\d{1,5})?$/i

/**
 * @param {unknown} origins
 * @returns {string[]} only the entries safe to put in a CSP source list
 */
export function sanitizeOrigins(origins) {
  if (!Array.isArray(origins)) return []
  return origins
    .filter((o) => typeof o === 'string')
    .map((o) => o.trim())
    .filter((o) => ORIGIN.test(o))
}

/**
 * The frame-ancestors value for a bot.
 *
 * null, undefined, [] and "every entry was malformed" all resolve to '*' — the
 * behaviour every bot has today. This default is the contract: a customer who
 * never opens the setting, and a lookup that fails, must both keep working. An
 * embed going dark is worse than the exposure this reduces.
 *
 * @param {unknown} origins
 * @returns {string}
 */
export function frameAncestorsFor(origins) {
  const safe = sanitizeOrigins(origins)
  return safe.length > 0 ? safe.join(' ') : '*'
}

/**
 * Normalises what a customer types in the dashboard into an origin.
 * "example.com" -> "https://example.com", "http://x.dev:3000" kept as typed.
 * Returns null for anything carrying a path, query or fragment.
 *
 * @param {string} input
 * @returns {string | null}
 */
export function normalizeOriginInput(input) {
  const trimmed = String(input || '').trim().replace(/\/+$/, '')
  if (!trimmed) return null
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  return ORIGIN.test(withScheme) ? withScheme : null
}
