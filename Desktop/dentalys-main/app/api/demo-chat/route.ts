// app/api/demo-chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { runAgent } from '@/lib/ai/agent'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // IP rate limit: max 10 requests per hour (prevents OpenAI credit abuse)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed } = rateLimit(`demo:${ip}`, 10, 60 * 60_000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

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
    .single() as any

  if (!profile?.business_id) {
    return NextResponse.json({ error: 'No business found' }, { status: 404 })
  }

  try {
    // Check that business has at least 1 service and 1 FAQ
    const { count: serviceCount } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', profile.business_id)
      .eq('is_active', true)

    if (!serviceCount || serviceCount === 0) {
      return NextResponse.json(
        { error: 'Please add at least one service before testing the demo.' },
        { status: 400 }
      )
    }

    const { count: faqCount } = await supabase
      .from('faq_items')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', profile.business_id)
      .eq('is_active', true)

    if (!faqCount || faqCount === 0) {
      return NextResponse.json(
        { error: 'Please add at least one FAQ before testing the demo.' },
        { status: 400 }
      )
    }

    const { message, sessionId } = await request.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message too long (max 2000 characters)' },
        { status: 400 }
      )
    }

    // Use sessionId to isolate each demo session — prevents stale thread history
    // and handed_off status from bleeding across page loads
    const chatId = sessionId ? `demo_${user.id}_${sessionId}` : `demo_${user.id}`

    const reply = await runAgent({
      db: createAdminClient(),
      businessId: profile.business_id,
      chatId,
      userMessage: message.trim(),
      channel: 'telegram',
    })

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Demo chat error:', err)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
