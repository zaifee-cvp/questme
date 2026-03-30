import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceClient } from '@/lib/supabase/server'
import { generateQrDataUrl, generateQrToken } from '@/lib/qr/generator'

// GET /api/qr/generate?token=xxx - returns a QR data URL for display
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const dataUrl = await generateQrDataUrl(token, appUrl)
  return NextResponse.json({ dataUrl })
}
