import { EMBED_ALLOWED_ORIGINS } from './lib/embed-origins.mjs'

/** @type {import('next').NextConfig} */

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

const cspDirectives = [
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

const csp = (frameAncestors) =>
  [...cspDirectives, `frame-ancestors ${frameAncestors}`].join('; ')

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
 * 'none' the browser refused that frame on every site, so the product's embed
 * script was blocked by the product's own headers.
 *
 * X-Frame-Options is ABSENT here rather than set to a permissive value. It
 * cannot express an allowlist — the spec has no multi-origin form, ALLOW-FROM
 * is dead, and browsers disagree on what an unrecognised value means — and in
 * older browsers that honour it but not frame-ancestors it would override the
 * CSP below and block every embed. Absence is the only deterministic state;
 * frame-ancestors is what grants framing in every browser that matters.
 *
 * The allowlist is EMBED_ALLOWED_ORIGINS — the portfolio's own product domains,
 * not arbitrary third-party sites. 'self' is kept so questme.ai can frame its
 * own chat page regardless of what the list holds.
 *
 * Safe by design: /chat/[botId] is public, is excluded from the middleware
 * matcher, and carries no authenticated session — there is nothing for a
 * clickjacker to trick a logged-in user into clicking.
 */
const embeddableChatHeaders = [
  ...baseHeaders,
  { key: 'Content-Security-Policy', value: csp(["'self'", ...EMBED_ALLOWED_ORIGINS].join(' ')) },
]

const nextConfig = {
  async redirects() {
    return [
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
