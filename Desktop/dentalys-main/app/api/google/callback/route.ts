// app/api/google/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  exchangeCodeForTokens,
  getGoogleAccountEmail,
} from '@/lib/google/calendar'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state') // businessId
  const error = url.searchParams.get('error')
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''

  if (error || !code || !state) {
    return NextResponse.redirect(
      `${appUrl}/dashboard/calendar?error=failed`
    )
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code)

    // Get Google account email
    const email = await getGoogleAccountEmail(tokens.access_token || '')

    // Verify user owns this business
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('id', state)
        .eq('owner_id', user.id)
        .single()

      if (!business) {
        return NextResponse.redirect(
          `${appUrl}/dashboard/calendar?error=unauthorized`
        )
      }
    }

    // Upsert calendar connection using admin client
    const db = createAdminClient()
    await db.from('calendar_connections').upsert(
      {
        business_id: state,
        google_account_email: email,
        calendar_id: 'primary',
        access_token: tokens.access_token || null,
        refresh_token: tokens.refresh_token || null,
        token_expiry: tokens.expiry_date
          ? new Date(tokens.expiry_date).toISOString()
          : null,
        is_active: true,
      },
      { onConflict: 'business_id' }
    )

    // Update setup progress
    const { data: biz } = await db
      .from('businesses')
      .select('setup_progress')
      .eq('id', state)
      .single()

    await db
      .from('businesses')
      .update({
        setup_progress: {
          ...((biz?.setup_progress as Record<string, boolean>) || {}),
          calendar: true,
        },
      })
      .eq('id', state)

    return NextResponse.redirect(
      `${appUrl}/dashboard/calendar?success=connected`
    )
  } catch (err) {
    console.error('Google callback error:', err)
    return NextResponse.redirect(
      `${appUrl}/dashboard/calendar?error=failed`
    )
  }
}
