// app/api/import/history/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

  try {
    const { data: imports, error } = await supabase
      .from('customer_imports')
      .select('*')
      .eq('business_id', profile.business_id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return NextResponse.json({ imports: imports || [] })
  } catch (err) {
    console.error('Import history error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch import history' },
      { status: 500 }
    )
  }
}
