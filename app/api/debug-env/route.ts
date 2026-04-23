import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const keySet = !!process.env.OPENAI_API_KEY
  const keyPrefix = keySet ? process.env.OPENAI_API_KEY!.slice(0, 10) + '...' : 'NOT SET'

  let embedTest: string
  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: 'test' }),
    })
    const data = await res.json()
    if (res.ok && data.data?.[0]?.embedding?.length) {
      embedTest = `OK (length=${data.data[0].embedding.length})`
    } else {
      embedTest = `FAILED status=${res.status} error=${JSON.stringify(data.error)}`
    }
  } catch (e: any) {
    embedTest = `EXCEPTION: ${e.message}`
  }

  return NextResponse.json({
    OPENAI_API_KEY: keyPrefix,
    embedTest,
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
  })
}
