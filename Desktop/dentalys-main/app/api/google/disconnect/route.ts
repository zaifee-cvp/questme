// app/api/google/disconnect/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function handleDisconnect() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('business_id')
    .eq('id', user.id)
    .single()

  if (!profile?.business_id) {
    return NextResponse.json({ error: 'No business found' }, { status: 404 })
  }

  try {
    await supabase
      .from('calendar_connections')
      .update({ is_active: false })
      .eq('business_id', profile.business_id)

    // Update setup progress
    const { data: biz } = await supabase
      .from('businesses')
      .select('setup_progress')
      .eq('id', profile.business_id)
      .single()

    await supabase
      .from('businesses')
      .update({
        setup_progress: {
          ...((biz?.setup_progress as Record<string, boolean>) || {}),
          calendar: false,
        },
      })
      .eq('id', profile.business_id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Google disconnect error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  return handleDisconnect()
}

// Also support POST so HTML <form method="POST"> works from the calendar page
export async function POST() {
  const response = await handleDisconnect()
  // After successful disconnect, redirect back to the calendar page
  if (response.status === 200) {
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/calendar`,
      303
    )
  }
  return response
}
