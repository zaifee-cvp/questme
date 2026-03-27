import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { exchangeCodeForTokens, getGoogleAccountEmail } from '@/lib/google/calendar'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // businessId
  const error = searchParams.get('error')

  if (error || !code || !state) {
    return NextResponse.redirect(
      new URL('/dashboard/calendar?error=access_denied', request.url)
    )
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code)

    // Get Google account email
    const googleEmail = await getGoogleAccountEmail(tokens.access_token || '')

    // Save to calendar_connections table
    const { error: dbError } = await supabase
      .from('calendar_connections')
      .upsert({
        business_id: state,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: tokens.expiry_date
          ? new Date(tokens.expiry_date).toISOString()
          : null,
        google_account_email: googleEmail,
        calendar_id: 'primary',
        is_active: true,
      }, { onConflict: 'business_id' })

    if (dbError) {
      console.error('Calendar connection error:', dbError)
      return NextResponse.redirect(
        new URL(`/dashboard/calendar?error=${encodeURIComponent(dbError.message)}`, request.url)
      )
    }

    // Update setup progress
    await supabase
      .from('businesses')
      .update({
        setup_progress: { calendar: true }
      })
      .eq('id', state)

    return NextResponse.redirect(
      new URL('/dashboard/calendar?success=connected', request.url)
    )
  } catch (err) {
    console.error('Google callback error:', err)
    const errorMessage = err instanceof Error ? err.message : 'unknown'
    return NextResponse.redirect(
      new URL(`/dashboard/calendar?error=${encodeURIComponent(errorMessage)}`, request.url)
    )
  }
}
