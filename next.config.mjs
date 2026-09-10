/** @type {import('next').NextConfig} */
import { csp } from './lib/embed-origins.mjs'


/**
 * Everything except the two directives that decide whether a page may be
 * framed. Shared, so the app's protections cannot drift apart from the chat
 * widget's: adding a CSP directive here adds it to both.
 */
const baseHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
]

/** The app: dashboard, auth, billing, marketing. Never framed by anyone. */
const securityHeaders = [
  ...baseHeaders,
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: csp("'none'") },
]

/**
 * The public chat widget page, which exists to be framed.
 *
 * public/widget.js — the embed snippet handed to every customer — mounts a
 * bubble that iframes /chat/<botId>. Under the app's own DENY + frame-ancestors
 * 'none' the browser refused that frame on every customer site, so the product's
 * embed script was blocked by the product's own headers.
 *
 * X-Frame-Options is ABSENT here rather than set to a permissive value. There
 * is no standard "allow any origin" value for it — ALLOWALL is not in the spec
 * and browsers disagree on what an unrecognised value means — so absence is the
 * only deterministic state. frame-ancestors is what actually grants framing in
 * every browser that matters, and it takes precedence where both are present.
 *
 * `*` because the widget's whole premise is arbitrary customer domains. A
 * per-bot allowlist is the right long-term answer and needs the origin resolved
 * per request; it is not this change.
 *
 * Safe by design: /chat/[botId] is public, is excluded from the middleware
 * matcher, and carries no authenticated session — there is nothing for a
 * clickjacker to trick a logged-in user into clicking. Same model as
 * Intercom and Crisp.
 */
const embeddableChatHeaders = [
  ...baseHeaders,
  { key: 'Content-Security-Policy', value: csp('*') },
]

const nextConfig = {
  async redirects() {
    return [
      // /pricing was linked externally but never existed as a route; the nav
      // points at the homepage anchor.
      { source: '/pricing', destination: '/#pricing', permanent: true },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.questme.ai' }],
        destination: 'https://questme.ai/:path*',
        permanent: true,
      },
    ]
  },
  async headers() {
    // The two sources partition every path: nothing is matched twice, so no
    // header depends on Next's same-key override order, and nothing is matched
    // zero times, so no path is served without security headers.
    //
    // The lookahead is `chat/.` — chat/ followed by at least one character —
    // and the chat entry uses `:path+`, which requires at least one segment.
    // The two agree exactly, so the paths with no bot id (/chat and /chat/,
    // both of which redirect away) fall to the catch-all and stay protected.
    // A bare `(?!chat/)` lookahead would leave /chat/ matching neither.
    return [
      // Everything except the embeddable chat page. Unchanged: DENY and
      // frame-ancestors 'none' still protect the dashboard, auth and billing.
      {
        source: '/((?!chat/.).*)',
        headers: securityHeaders,
      },
      // /chat/* is excluded above because public/widget.js embeds it in an
      // iframe on customer sites. See embeddableChatHeaders.
      {
        source: '/chat/:path+',
        headers: embeddableChatHeaders,
      },
    ]
  },
}

export default nextConfig
