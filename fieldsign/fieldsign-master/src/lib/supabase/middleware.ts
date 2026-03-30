import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          )
        },
      },
    }
  )

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ---- Protect /dashboard routes (admin only) ----
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, company_id')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      // Redirect non-admins away
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

    // ---- Check subscription status (skip billing page to avoid redirect loop) ----
    if (!pathname.startsWith('/dashboard/billing') && profile.company_id) {
      const { data: company } = await supabase
        .from('companies')
        .select('subscription_status')
        .eq('id', profile.company_id)
        .single()

      const allowed = ['trialing', 'active', 'past_due']
      const status = company?.subscription_status ?? null

      if (!allowed.includes(status ?? '')) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard/billing'
        return NextResponse.redirect(url)
      }
    }
  }

  // ---- Redirect authenticated users away from auth pages ----
  if (pathname.startsWith('/auth/') && user &&
    pathname !== '/auth/forgot-password' && pathname !== '/auth/reset-password') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
