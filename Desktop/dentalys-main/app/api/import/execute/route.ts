// app/api/import/execute/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface ImportRecord {
  name: string
  phone: string
  email?: string
  tags?: string[]
  notes?: string
  is_first_time?: boolean
}

export async function POST(request: NextRequest) {
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
    const {
      records,
      duplicateAction,
      fileName,
    }: {
      records: ImportRecord[]
      duplicateAction: 'skip' | 'update' | 'create_new'
      fileName: string
    } = await request.json()

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: 'No records to import' },
        { status: 400 }
      )
    }

    if (records.length > 10000) {
      return NextResponse.json(
        { error: 'Exceeds maximum of 10,000 records' },
        { status: 400 }
      )
    }

    let imported = 0
    let updated = 0
    let skipped = 0
    let failed = 0

    for (const record of records) {
      if (!record.name || !record.phone) {
        failed++
        continue
      }

      try {
        // Check if phone already exists for this business
        const { data: existing } = await supabase
          .from('customers')
          .select('id')
          .eq('business_id', profile.business_id)
          .eq('phone', record.phone)
          .single()

        if (existing) {
          if (duplicateAction === 'skip') {
            skipped++
            continue
          } else if (duplicateAction === 'update') {
            await supabase
              .from('customers')
              .update({
                name: record.name,
                email: record.email || null,
                tags: record.tags || [],
                notes: record.notes || null,
                is_first_time:
                  record.is_first_time !== undefined
                    ? record.is_first_time
                    : false,
              })
              .eq('id', existing.id)
            updated++
            continue
          }
          // create_new falls through to insert
        }

        await supabase.from('customers').insert({
          business_id: profile.business_id,
          name: record.name,
          phone: record.phone,
          email: record.email || null,
          tags: record.tags || [],
          notes: record.notes || null,
          is_first_time:
            record.is_first_time !== undefined ? record.is_first_time : true,
          import_source: 'csv' as const,
        })
        imported++
      } catch {
        failed++
      }
    }

    // Create import history record
    await supabase.from('customer_imports').insert({
      business_id: profile.business_id,
      file_name: fileName || 'unknown',
      total_rows: records.length,
      imported_count: imported,
      skipped_count: skipped,
      error_count: failed,
      status: 'completed' as const,
    })

    return NextResponse.json({
      success: true,
      total: records.length,
      imported,
      updated,
      skipped,
      failed,
    })
  } catch (err) {
    console.error('Import execute error:', err)
    return NextResponse.json(
      { error: 'Failed to import records' },
      { status: 500 }
    )
  }
}
