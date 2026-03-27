// app/api/usage/route.ts
// Returns current usage vs. plan limits for the authenticated user's business.

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessUsage } from '@/lib/usage'

export async function GET() {
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

  const usage = await getBusinessUsage(profile.business_id)
  return NextResponse.json(usage)
}
