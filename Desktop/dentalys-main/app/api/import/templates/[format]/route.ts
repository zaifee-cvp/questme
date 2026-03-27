// app/api/import/templates/[format]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  CSV_TEMPLATE_CONTENT,
  JSON_TEMPLATE_CONTENT,
  VCF_EXAMPLE_CONTENT,
  FIELD_GUIDE,
} from '@/lib/import/templates'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ format: string }> }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { format } = await params

  switch (format) {
    case 'csv': {
      return new NextResponse(CSV_TEMPLATE_CONTENT, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition':
            'attachment; filename="customer_import_template.csv"',
        },
      })
    }

    case 'json': {
      return new NextResponse(JSON_TEMPLATE_CONTENT, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition':
            'attachment; filename="customer_import_template.json"',
        },
      })
    }

    case 'vcf': {
      return new NextResponse(VCF_EXAMPLE_CONTENT, {
        status: 200,
        headers: {
          'Content-Type': 'text/vcard',
          'Content-Disposition':
            'attachment; filename="customer_import_example.vcf"',
        },
      })
    }

    case 'guide': {
      const guideText = FIELD_GUIDE.map(
        (f) => `${f.field} (${f.required ? 'required' : 'optional'}): ${f.format} — e.g. ${f.example}`
      ).join('\n')
      return new NextResponse(guideText, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition':
            'attachment; filename="import_field_guide.txt"',
        },
      })
    }

    default:
      return NextResponse.json(
        { error: 'Invalid format. Use csv, json, vcf, or guide.' },
        { status: 400 }
      )
  }
}
