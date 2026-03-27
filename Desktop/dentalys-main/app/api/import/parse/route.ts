// app/api/import/parse/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  parseVCF,
  parseJSON,
  autoDetectMapping,
} from '@/lib/import/parsers'
import { findDuplicates } from '@/lib/import/duplicates'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

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
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    const fileName = file.name.toLowerCase()
    let records: any[]
    let headers: string[] = []

    if (fileName.endsWith('.csv')) {
      const text = await file.text()
      const parsed = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h: string) => h.trim(),
      })
      headers = parsed.meta.fields || []
      records = parsed.data
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' })
      if (data.length > 0) {
        headers = Object.keys(data[0])
      }
      records = data
    } else if (fileName.endsWith('.vcf') || fileName.endsWith('.vcard')) {
      const text = await file.text()
      const result = parseVCF(text)
      records = result.records
    } else if (fileName.endsWith('.json')) {
      const text = await file.text()
      const result = parseJSON(text)
      records = result.records
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Use CSV, XLSX, VCF, or JSON.' },
        { status: 400 }
      )
    }

    if (records.length === 0) {
      return NextResponse.json(
        { error: 'No records found in the file' },
        { status: 400 }
      )
    }

    if (records.length > 10000) {
      return NextResponse.json(
        { error: 'File exceeds the maximum of 10,000 records' },
        { status: 400 }
      )
    }

    // Auto-detect field mapping
    const mapping = autoDetectMapping(headers)

    // Check for duplicates against existing customers
    const duplicates = await findDuplicates(
      supabase as any,
      profile.business_id,
      records
    )

    return NextResponse.json({
      records,
      headers,
      mapping,
      duplicates,
      total: records.length,
      duplicateCount: duplicates.length,
      newCount: records.length - duplicates.length,
    })
  } catch (err) {
    console.error('Import parse error:', err)
    return NextResponse.json(
      { error: 'Failed to parse file' },
      { status: 500 }
    )
  }
}
