import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { csp, frameAncestorsFor } from '@/lib/embed-origins.mjs'

/** /chat/<botId> — exactly one segment after /chat. */
const CHAT_ROUTE = /^\/chat\/([^/]+)$/

/** Cheap reject before we spend a round trip on a path that cannot be a bot. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handled FIRST, before the Supabase client below is constructed. /chat/[botId]
  // is public and carries no session, so putting a getUser() round trip in front
  // of every widget open would be its own regression. This runs once per widget
  // open — messages go to /api/chat, which the matcher excludes.
  const chat = pathname.match(CHAT_ROUTE)
  if (chat) return chatResponse(request, chat[1])

  // A bare /chat (no botId) has no bot to render and would 404 through this edge
  // middleware. The valid chat route is /chat/[botId]; never dead-end a visitor on
  // /chat — send them home instead of returning a 404.
  //
  // Only the '/chat' arm ever fires. The old matcher's `chat/` lookahead
  // excluded '/chat/' outright; with that lookahead gone the matcher does cover
  // it, but Next still normalises '/chat/' to '/chat' with a 308 before
  // middleware runs — measured, not assumed. The second arm is kept because it
  // becomes load-bearing the day trailingSlash is turned on, and costs a string
  // compare until then.
  if (pathname === '/chat' || pathname === '/chat/') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  if ((pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/forgot-password' || pathname === '/reset-password') && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

/**
 * The chat page's headers, with frame-ancestors resolved for this specific bot.
 *
 * next.config.mjs still carries a '/chat/:path+' entry serving frame-ancestors *.
 * That is the deliberate fallback: if this middleware never runs, or the lookup
 * below fails, the widget stays framable. A customer's embed going dark is worse
 * than the exposure the allowlist reduces.
 */
async function chatResponse(request: NextRequest, botId: string) {
  const response = NextResponse.next({ request })
  response.headers.set('Content-Security-Policy', csp(await resolveFrameAncestors(botId)))
  return response
}

/**
 * Reads one bot's allowed_origins by primary key.
 *
 * Uses the service role over PostgREST rather than a Supabase client: RLS is on
 * for public.bots and no policy grants anon a read, so the anon key cannot see
 * this column — and createSupabaseServiceClient() is built on require(), which
 * the edge runtime has no answer for.
 *
 * Every failure path returns '*': no env, non-UUID id, HTTP error, unknown bot,
 * and — importantly — the window before the allowed_origins migration is applied,
 * where PostgREST answers 400 for the unknown column. Fail open, always.
 */
async function resolveFrameAncestors(botId: string): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key || !UUID.test(botId)) return '*'

  try {
    const res = await fetch(
      `${url}/rest/v1/bots?id=eq.${encodeURIComponent(botId)}&select=allowed_origins`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
        cache: 'no-store',
      },
    )
    if (!res.ok) return '*'
    const rows = await res.json()
    return frameAncestorsFor(Array.isArray(rows) ? rows[0]?.allowed_origins : undefined)
  } catch {
    return '*'
  }
}

export const config = {
  // 'chat/' is no longer excluded, so the per-bot frame-ancestors value can be
  // resolved per request.
  //
  // A second '/chat/:botId' entry was the obvious way to do that and does not
  // work: Next compiles a trailing named param together with its _next/data
  // handling into ^/chat(?:/(.json))?$, which matches /chat and never
  // /chat/<id>, so the middleware silently never ran. Verified in
  // .next/server/middleware-manifest.json. One matcher, no params, no ambiguity.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
