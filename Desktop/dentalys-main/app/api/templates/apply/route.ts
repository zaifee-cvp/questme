// app/api/templates/apply/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  TEMPLATE_SERVICES,
  TEMPLATE_FAQS,
  TEMPLATE_PROMOTIONS,
} from '@/lib/templates'

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
      categories,
      includeAllServices,
      includeFaqs,
      includePromotions,
    }: {
      categories?: string[]
      includeAllServices?: boolean
      includeFaqs?: boolean
      includePromotions?: boolean
    } = await request.json()

    let servicesAdded = 0
    let faqsAdded = 0
    let promotionsAdded = 0

    // Apply service templates
    const servicesToInsert = includeAllServices
      ? TEMPLATE_SERVICES
      : categories && categories.length > 0
        ? TEMPLATE_SERVICES.filter((s) => categories.includes(s.category))
        : []

    for (const service of servicesToInsert) {
      const { error } = await supabase.from('services').insert({
        business_id: profile.business_id,
        name: service.name,
        duration_minutes: service.duration,
        is_active: true,
      } as any)
      if (!error) servicesAdded++
    }

    // Apply FAQ templates
    if (includeFaqs) {
      for (const faq of TEMPLATE_FAQS) {
        const { error } = await supabase.from('faq_items').insert({
          business_id: profile.business_id,
          question: faq.question,
          answer: faq.answer,
          is_active: true,
        } as any)
        if (!error) faqsAdded++
      }
    }

    // Apply promotion templates
    if (includePromotions) {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 30)

      for (const promo of TEMPLATE_PROMOTIONS) {
        const { error } = await supabase.from('promotions').insert({
          business_id: profile.business_id,
          title: promo.description,
          description: promo.description,
          discount_type: promo.discount_type,
          discount_value: promo.discount_value,
          promo_code: promo.code,
          first_time_only: false,
          valid_from: startDate.toISOString(),
          valid_until: endDate.toISOString(),
          is_active: promo.active,
        } as any)
        if (!error) promotionsAdded++
      }
    }

    // Update setup progress
    if (servicesAdded > 0 || faqsAdded > 0) {
      const { data: business } = await supabase
        .from('businesses')
        .select('setup_progress')
        .eq('id', profile.business_id)
        .single()

      const progress = (business?.setup_progress as Record<string, boolean>) || {}
      if (servicesAdded > 0) progress.services = true
      if (faqsAdded > 0) progress.faq = true

      await supabase
        .from('businesses')
        .update({ setup_progress: progress })
        .eq('id', profile.business_id)
    }

    return NextResponse.json({
      success: true,
      servicesAdded,
      faqsAdded,
      promotionsAdded,
    })
  } catch (err) {
    console.error('Template apply error:', err)
    return NextResponse.json(
      { error: 'Failed to apply templates' },
      { status: 500 }
    )
  }
}
