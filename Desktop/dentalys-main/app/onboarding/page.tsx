// app/onboarding/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Check,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Gift,
  MessageSquare,
  Send,
  Calendar,
  BookOpen,
  LayoutTemplate,
  CreditCard,
} from 'lucide-react'
import {
  SUPPORTED_TIMEZONES,
  SUPPORTED_CURRENCIES,
  SUPPORTED_LANGUAGES,
} from '@/types'

// ============================================================
// Country list
// ============================================================
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh',
  'Belgium', 'Bolivia', 'Bosnia and Herzegovina', 'Brazil',
  'Brunei', 'Bulgaria', 'Cambodia', 'Canada', 'Chile', 'China',
  'Colombia', 'Costa Rica', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Dominican Republic', 'Ecuador', 'Egypt', 'Estonia',
  'Ethiopia', 'Finland', 'France', 'Georgia', 'Germany', 'Ghana',
  'Greece', 'Guatemala', 'Honduras', 'Hong Kong', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kuwait', 'Laos', 'Latvia', 'Lebanon', 'Libya',
  'Lithuania', 'Luxembourg', 'Macau', 'Malaysia', 'Maldives',
  'Malta', 'Mexico', 'Moldova', 'Mongolia', 'Montenegro',
  'Morocco', 'Myanmar', 'Nepal', 'Netherlands', 'New Zealand',
  'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
  'Palestine', 'Panama', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
  'Saudi Arabia', 'Senegal', 'Serbia', 'Singapore', 'Slovakia',
  'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka',
  'Sudan', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
  'Tanzania', 'Thailand', 'Tunisia', 'Turkey', 'UAE',
  'Uganda', 'UK', 'Ukraine', 'Uruguay', 'USA',
  'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zimbabwe',
]

// ============================================================
// Slug generator
// ============================================================
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

// ============================================================
// Step labels
// ============================================================
const STEPS = [
  'Clinic Profile',
  'Services',
  'Promotion',
  'Channels',
  'All Done!',
]

// ============================================================
// Types
// ============================================================
interface ServiceRow {
  id?: string
  name: string
  duration_minutes: number
  price: number
  is_active: boolean
  _new?: boolean
}

interface PromotionData {
  title: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  promo_code: string
  first_time_only: boolean
  is_active: boolean
}

interface SetupSummary {
  serviceCount: number
  faqCount: number
  telegramConnected: boolean
  telegramUsername: string
  whatsappConnected: boolean
  whatsappNumber: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  // Global state
  const [currentStep, setCurrentStep] = useState(1)
  const [businessId, setBusinessId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [initialLoading, setInitialLoading] = useState(true)

  // Step 1 — Clinic Profile
  const [clinicName, setClinicName] = useState('')
  const [country, setCountry] = useState('')
  const [timezone, setTimezone] = useState('UTC')
  const [currency, setCurrency] = useState('USD')
  const [language, setLanguage] = useState('en')
  const [clinicEmail, setClinicEmail] = useState('')
  const [clinicPhone, setClinicPhone] = useState('')
  const [clinicAddress, setClinicAddress] = useState('')
  const [clinicWebsite, setClinicWebsite] = useState('')

  // Step 2 — Services
  const [services, setServices] = useState<ServiceRow[]>([])

  // Step 3 — Promotion
  const [promotion, setPromotion] = useState<PromotionData>({
    title: 'Welcome 15% Off',
    description:
      'Get 15% off your first treatment! Use code WELCOME15 when booking.',
    discount_type: 'percentage',
    discount_value: 15,
    promo_code: 'WELCOME15',
    first_time_only: true,
    is_active: true,
  })

  // Step 4 — Channels
  const [telegramToken, setTelegramToken] = useState('')
  const [telegramConnected, setTelegramConnected] = useState(false)
  const [telegramUsername, setTelegramUsername] = useState('')
  const [telegramLoading, setTelegramLoading] = useState(false)
  const [telegramError, setTelegramError] = useState('')
  const [whatsappProvider, setWhatsappProvider] = useState('wati')
  const [whatsappApiUrl, setWhatsappApiUrl] = useState('')
  const [whatsappToken, setWhatsappToken] = useState('')
  const [whatsappConnected, setWhatsappConnected] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [whatsappLoading, setWhatsappLoading] = useState(false)
  const [whatsappError, setWhatsappError] = useState('')

  // Step 5 — Summary
  const [summary, setSummary] = useState<SetupSummary>({
    serviceCount: 0,
    faqCount: 0,
    telegramConnected: false,
    telegramUsername: '',
    whatsappConnected: false,
    whatsappNumber: '',
  })

  // ============================================================
  // Check existing progress on mount
  // ============================================================
  useEffect(() => {
    async function checkProgress() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .single()

      if (profile?.business_id) {
        setBusinessId(profile.business_id)

        const { data: business } = await supabase
          .from('businesses')
          .select('setup_progress, onboarding_completed')
          .eq('id', profile.business_id)
          .single()

        if (business?.onboarding_completed) {
          router.push('/dashboard')
          return
        }

        const progress = (business?.setup_progress || {}) as Record<
          string,
          boolean
        >

        if (progress.profile) {
          // Load services for step 2
          const { data: svc } = await supabase
            .from('services')
            .select('id, name, duration_minutes, price, is_active')
            .eq('business_id', profile.business_id)
            .order('created_at', { ascending: true })

          if (svc && svc.length > 0) {
            setServices(svc.map((s) => ({ ...s, price: s.price || 0 })))
          } else if (!progress.services) {
            // Auto-apply dental templates if no services exist yet
            await fetch('/api/templates/apply', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                includeAllServices: true,
                includeFaqs: true,
                includePromotions: true,
              }),
            })
            // Re-fetch services after applying template
            const { data: svc2 } = await supabase
              .from('services')
              .select('id, name, duration_minutes, price, is_active')
              .eq('business_id', profile.business_id)
              .order('created_at', { ascending: true })
            if (svc2) setServices(svc2.map((s) => ({ ...s, price: s.price || 0 })))
          }

          if (progress.services) setCurrentStep(3)
          else setCurrentStep(2)

          if (progress.promotion) setCurrentStep(4)
          if (progress.telegram || progress.whatsapp) setCurrentStep(5)
        }
      }

      setInitialLoading(false)
    }
    checkProgress()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ============================================================
  // Currency symbol helper
  // ============================================================
  const currencySymbol =
    SUPPORTED_CURRENCIES.find((c) => c.code === currency)?.symbol || '$'

  // ============================================================
  // Step 1 — Save Profile
  // ============================================================
  const handleSaveProfile = async () => {
    if (!clinicName.trim() || !country || !timezone || !currency || !language) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const slug = toSlug(clinicName)

      // Check slug uniqueness
      const { data: existingSlug } = await supabase
        .from('businesses')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()

      if (existingSlug && existingSlug.id !== businessId) {
        setError('This clinic name is already taken. Please choose a different name.')
        setLoading(false)
        return
      }

      if (businessId) {
        // Update existing business
        await supabase
          .from('businesses')
          .update({
            name: clinicName.trim(),
            slug,
            country,
            timezone,
            currency,
            language,
            email: clinicEmail || null,
            phone: clinicPhone || null,
            address: clinicAddress || null,
            website: clinicWebsite || null,
            setup_progress: { profile: true },
          })
          .eq('id', businessId)
      } else {
        // Create new business
        const { data: newBiz, error: bizError } = await supabase
          .from('businesses')
          .insert({
            name: clinicName.trim(),
            slug,
            country,
            timezone,
            currency,
            language,
            email: clinicEmail || null,
            phone: clinicPhone || null,
            address: clinicAddress || null,
            website: clinicWebsite || null,
            setup_progress: { profile: true },
            owner_id: user.id,
          })
          .select('id')
          .single()

        if (bizError) throw bizError

        setBusinessId(newBiz.id)

        // Link profile to business
        await supabase
          .from('profiles')
          .update({ business_id: newBiz.id })
          .eq('id', user.id)

        // Apply default templates
        await fetch('/api/templates/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            includeAllServices: true,
            includeFaqs: true,
            includePromotions: true,
          }),
        })

        // Load newly created services
        const { data: svc } = await supabase
          .from('services')
          .select('id, name, duration_minutes, price, is_active')
          .eq('business_id', newBiz.id)
          .order('created_at', { ascending: true })

        if (svc) setServices(svc.map((s) => ({ ...s, price: s.price || 0 })))
      }

      setCurrentStep(2)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // Step 2 — Save Services
  // ============================================================
  const handleSaveServices = async () => {
    setLoading(true)
    setError('')

    try {
      for (const svc of services) {
        if (svc._new) {
          if (!svc.name.trim()) continue
          await supabase.from('services').insert({
            business_id: businessId,
            name: svc.name.trim(),
            duration_minutes: svc.duration_minutes,
            price: svc.price,
            is_active: svc.is_active,
          })
        } else if (svc.id) {
          await supabase
            .from('services')
            .update({
              name: svc.name.trim(),
              duration_minutes: svc.duration_minutes,
              price: svc.price,
              is_active: svc.is_active,
            })
            .eq('id', svc.id)
        }
      }

      // Update setup progress
      const { data: biz } = await supabase
        .from('businesses')
        .select('setup_progress')
        .eq('id', businessId)
        .single()

      const progress = ((biz?.setup_progress || {}) as Record<string, boolean>)
      progress.services = true

      await supabase
        .from('businesses')
        .update({ setup_progress: progress })
        .eq('id', businessId)

      setCurrentStep(3)
    } catch (err: any) {
      setError(err.message || 'Failed to save services')
    } finally {
      setLoading(false)
    }
  }

  const addService = () => {
    setServices([
      ...services,
      {
        name: '',
        duration_minutes: 30,
        price: 0,
        is_active: true,
        _new: true,
      },
    ])
  }

  const removeService = async (index: number) => {
    const svc = services[index]
    if (svc.id && !svc._new) {
      await supabase.from('services').delete().eq('id', svc.id)
    }
    setServices(services.filter((_, i) => i !== index))
  }

  const updateService = (
    index: number,
    field: keyof ServiceRow,
    value: string | number | boolean
  ) => {
    const updated = [...services]
    updated[index] = { ...updated[index], [field]: value }
    setServices(updated)
  }

  // ============================================================
  // Step 3 — Save Promotion
  // ============================================================
  const handleSavePromotion = async () => {
    setLoading(true)
    setError('')

    try {
      // Find existing welcome promotion or create it
      const { data: existing } = await supabase
        .from('promotions')
        .select('id')
        .eq('business_id', businessId)
        .eq('promo_code', 'WELCOME15')
        .maybeSingle()

      const startDate = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 12)

      const promoData = {
        business_id: businessId,
        title: promotion.title,
        description: promotion.description,
        discount_type: promotion.discount_type,
        discount_value: promotion.discount_value,
        promo_code: promotion.promo_code,
        first_time_only: promotion.first_time_only,
        is_active: promotion.is_active,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      }

      if (existing) {
        await supabase
          .from('promotions')
          .update(promoData)
          .eq('id', existing.id)
      } else {
        await supabase.from('promotions').insert(promoData)
      }

      const { data: biz } = await supabase
        .from('businesses')
        .select('setup_progress')
        .eq('id', businessId)
        .single()

      const progress = ((biz?.setup_progress || {}) as Record<string, boolean>)
      progress.promotion = true

      await supabase
        .from('businesses')
        .update({ setup_progress: progress })
        .eq('id', businessId)

      setCurrentStep(4)
    } catch (err: any) {
      setError(err.message || 'Failed to save promotion')
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // Step 4 — Connect Telegram
  // ============================================================
  const handleConnectTelegram = async () => {
    if (!telegramToken.trim()) {
      setTelegramError('Please enter your bot token')
      return
    }

    setTelegramLoading(true)
    setTelegramError('')

    try {
      const res = await fetch('/api/telegram/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: telegramToken.trim() }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to connect')

      setTelegramConnected(true)
      setTelegramUsername(data.botUsername || '')
    } catch (err: any) {
      setTelegramError(err.message)
    } finally {
      setTelegramLoading(false)
    }
  }

  // ============================================================
  // Step 4 — Connect WhatsApp
  // ============================================================
  const handleConnectWhatsApp = async () => {
    if (!whatsappApiUrl.trim() || !whatsappToken.trim()) {
      setWhatsappError('Please fill in all fields')
      return
    }

    setWhatsappLoading(true)
    setWhatsappError('')

    try {
      const res = await fetch('/api/whatsapp/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: whatsappProvider,
          apiUrl: whatsappApiUrl.trim(),
          apiToken: whatsappToken.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to connect')

      setWhatsappConnected(true)
      setWhatsappNumber(data.phoneNumber || whatsappApiUrl)
    } catch (err: any) {
      setWhatsappError(err.message)
    } finally {
      setWhatsappLoading(false)
    }
  }

  // ============================================================
  // Step 4 → 5 transition
  // ============================================================
  const handleGoToSummary = useCallback(async () => {
    // Load summary data
    const { count: svcCount } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('is_active', true)

    const { count: faqCount } = await supabase
      .from('faq_items')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('is_active', true)

    setSummary({
      serviceCount: svcCount || 0,
      faqCount: faqCount || 0,
      telegramConnected,
      telegramUsername,
      whatsappConnected,
      whatsappNumber,
    })

    setCurrentStep(5)
  }, [businessId, supabase, telegramConnected, telegramUsername, whatsappConnected, whatsappNumber])

  // ============================================================
  // Step 5 — Finish
  // ============================================================
  const handleFinish = async () => {
    setLoading(true)
    await supabase
      .from('businesses')
      .update({ onboarding_completed: true })
      .eq('id', businessId)
    router.push('/dashboard')
  }

  // ============================================================
  // Loading state
  // ============================================================
  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
      </div>
    )
  }

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="min-h-screen bg-stone-50">
      {/* HEADER */}
      <div
        className="bg-white px-6 py-4"
        style={{ borderBottom: '0.5px solid #e7e5e4' }}
      >
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-[15px] font-medium tracking-[-0.3px] text-stone-800">
            dentalys.ai
          </p>
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            {STEPS.map((label, i) => {
              const step = i + 1
              const isActive = step === currentStep
              const isComplete = step < currentStep
              return (
                <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex w-full items-center">
                    <div
                      className={`h-1.5 w-full rounded-full transition-colors ${
                        isComplete || isActive
                          ? 'bg-[#0b7b6b]'
                          : 'bg-stone-200'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[11px] ${
                      isActive
                        ? 'font-medium text-[#0b7b6b]'
                        : isComplete
                          ? 'text-stone-500'
                          : 'text-stone-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        {error && (
          <div
            className="mb-6 flex items-center gap-2.5 rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-700 animate-fadeIn"
            style={{ border: '0.5px solid #fecaca' }}
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 1 — Clinic Profile */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <div className="animate-fadeIn">
            <h2 className="mb-2 text-[24px] font-medium tracking-[-0.5px] text-stone-900">
              Tell us about your clinic
            </h2>
            <p className="mb-8 text-[14px] text-stone-500">
              This helps us configure your AI receptionist.
            </p>

            <div className="space-y-5">
              {/* Clinic Name */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-stone-700">
                  Clinic Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="Lumière dental clinic"
                  className="w-full"
                />
                {clinicName.trim() && (
                  <p className="mt-1.5 text-[12px] text-stone-400">
                    dentalys.ai/{toSlug(clinicName)}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-stone-700">
                  Country <span className="text-red-400">*</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full"
                >
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timezone */}
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-stone-700">
                  Timezone <span className="text-red-400">*</span>
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full"
                >
                  {SUPPORTED_TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Currency + Language row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-stone-700">
                    Currency <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.symbol} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-stone-700">
                    Language <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-stone-400">
                    AI will respond in this language
                  </p>
                </div>
              </div>

              {/* Optional fields */}
              <div
                className="rounded-xl bg-stone-50 p-5"
                style={{ border: '0.5px solid #e7e5e4' }}
              >
                <p className="mb-4 text-[13px] font-medium text-stone-600">
                  Optional details
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[12px] text-stone-500">
                      Email
                    </label>
                    <input
                      type="email"
                      value={clinicEmail}
                      onChange={(e) => setClinicEmail(e.target.value)}
                      placeholder="hello@clinic.com"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] text-stone-500">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={clinicPhone}
                      onChange={(e) => setClinicPhone(e.target.value)}
                      placeholder="+65 9123 4567"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] text-stone-500">
                      Address
                    </label>
                    <input
                      type="text"
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                      placeholder="123 Orchard Road"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] text-stone-500">
                      Website
                    </label>
                    <input
                      type="url"
                      value={clinicWebsite}
                      onChange={(e) => setClinicWebsite(e.target.value)}
                      placeholder="https://clinic.com"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="btn-primary px-8 py-2.5 text-[14px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Next <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2 — Services */}
        {/* ======================================================== */}
        {currentStep === 2 && (
          <div className="animate-fadeIn">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-teal-600" />
              <h2 className="text-[24px] font-medium tracking-[-0.5px] text-stone-900">
                Your services are ready
              </h2>
            </div>
            <p className="mb-2 text-[14px] text-stone-500">
              We pre-loaded common treatments. Update prices to match your
              clinic.
            </p>
            <p className="mb-8 text-[12px] text-stone-400">
              Prices shown in USD — update to your local currency
            </p>

            <div className="space-y-3">
              {services.map((svc, i) => (
                <div
                  key={svc.id || `new-${i}`}
                  className="flex items-center gap-3 rounded-xl bg-white p-4"
                  style={{ border: '0.5px solid #e7e5e4' }}
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={svc.name}
                      onChange={(e) => updateService(i, 'name', e.target.value)}
                      placeholder="Service name"
                      className="w-full border-0 bg-transparent p-0 text-[14px] font-medium text-stone-800 focus:ring-0"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={svc.duration_minutes}
                        onChange={(e) =>
                          updateService(
                            i,
                            'duration_minutes',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-16 text-center text-[13px]"
                        min={5}
                      />
                      <span className="text-[12px] text-stone-400">min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[12px] text-stone-400">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        value={svc.price}
                        onChange={(e) =>
                          updateService(
                            i,
                            'price',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-20 text-center text-[13px]"
                        min={0}
                        step={1}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateService(i, 'is_active', !svc.is_active)
                      }
                      className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                        svc.is_active
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      {svc.is_active ? 'Active' : 'Off'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeService(i)}
                      className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addService}
              className="mt-4 flex items-center gap-2 text-[13px] font-medium text-teal-700 hover:text-teal-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add service
            </button>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-ghost text-[14px]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleSaveServices}
                disabled={loading}
                className="btn-primary px-8 py-2.5 text-[14px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Next <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3 — Welcome Promotion */}
        {/* ======================================================== */}
        {currentStep === 3 && (
          <div className="animate-fadeIn">
            <div className="mb-2 flex items-center gap-2">
              <Gift className="h-5 w-5 text-teal-600" />
              <h2 className="text-[24px] font-medium tracking-[-0.5px] text-stone-900">
                Your welcome offer is ready
              </h2>
            </div>
            <p className="mb-8 text-[14px] text-stone-500">
              First-time patients receive this automatically.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-stone-700">
                    Promotion Title
                  </label>
                  <input
                    type="text"
                    value={promotion.title}
                    onChange={(e) =>
                      setPromotion({ ...promotion, title: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-stone-700">
                    Description
                  </label>
                  <textarea
                    value={promotion.description}
                    onChange={(e) =>
                      setPromotion({
                        ...promotion,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full resize-none rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-stone-700">
                      Discount Type
                    </label>
                    <select
                      value={promotion.discount_type}
                      onChange={(e) =>
                        setPromotion({
                          ...promotion,
                          discount_type: e.target.value as 'percentage' | 'fixed',
                        })
                      }
                      className="w-full"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-stone-700">
                      Value
                    </label>
                    <input
                      type="number"
                      value={promotion.discount_value}
                      onChange={(e) =>
                        setPromotion({
                          ...promotion,
                          discount_value: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full"
                      min={0}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-stone-700">
                    Promo Code
                  </label>
                  <input
                    type="text"
                    value={promotion.promo_code}
                    onChange={(e) =>
                      setPromotion({
                        ...promotion,
                        promo_code: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full font-mono"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] text-stone-600">
                    <input
                      type="checkbox"
                      checked={promotion.first_time_only}
                      onChange={(e) =>
                        setPromotion({
                          ...promotion,
                          first_time_only: e.target.checked,
                        })
                      }
                      className="rounded border-stone-300 text-teal-600 focus:ring-teal-500"
                    />
                    First-time only
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-stone-600">
                    <input
                      type="checkbox"
                      checked={promotion.is_active}
                      onChange={(e) =>
                        setPromotion({
                          ...promotion,
                          is_active: e.target.checked,
                        })
                      }
                      className="rounded border-stone-300 text-teal-600 focus:ring-teal-500"
                    />
                    Active
                  </label>
                </div>
              </div>

              {/* Live preview */}
              <div>
                <p className="mb-3 text-[12px] font-medium uppercase tracking-wider text-stone-400">
                  AI preview
                </p>
                <div
                  className="rounded-xl bg-white p-5"
                  style={{ border: '0.5px solid #e7e5e4' }}
                >
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-br-md bg-stone-100 px-4 py-2.5 text-[13px] text-stone-600">
                        Do you have any offers for new patients?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-bl-md bg-teal-50 px-4 py-2.5 text-[13px] text-stone-700">
                        Great news! 🎉 {promotion.title}!{' '}
                        {promotion.description}
                        {promotion.promo_code &&
                          ` Use code ${promotion.promo_code} when booking.`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="btn-ghost text-[14px]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleSavePromotion}
                disabled={loading}
                className="btn-primary px-8 py-2.5 text-[14px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Next <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 4 — Connect Channels */}
        {/* ======================================================== */}
        {currentStep === 4 && (
          <div className="animate-fadeIn">
            <h2 className="mb-2 text-[24px] font-medium tracking-[-0.5px] text-stone-900">
              Connect your messaging bots 🤖
            </h2>
            <p className="mb-8 text-[14px] text-stone-500">
              Connect your Telegram bot to go live.
            </p>

            <div className="max-w-md">
              {/* TELEGRAM */}
              <div
                className="rounded-xl bg-white p-6"
                style={{ border: '0.5px solid #e7e5e4' }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#229ED9]/10">
                    <Send className="h-5 w-5 text-[#229ED9]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-stone-800">
                      Telegram
                    </h3>
                    {telegramConnected && (
                      <span className="inline-flex items-center gap-1 text-[12px] text-emerald-600">
                        <Check className="h-3 w-3" />
                        Connected @{telegramUsername}
                      </span>
                    )}
                  </div>
                </div>

                {!telegramConnected && (
                  <>
                    <div
                      className="mb-4 rounded-lg bg-stone-50 p-4 text-[13px] text-stone-500"
                      style={{ border: '0.5px solid #e7e5e4' }}
                    >
                      <p className="mb-2 font-medium text-stone-600">
                        How to get your bot token:
                      </p>
                      <ol className="list-inside list-decimal space-y-1">
                        <li>
                          Open Telegram and search for{' '}
                          <span className="font-medium">@BotFather</span>
                        </li>
                        <li>
                          Send <span className="font-mono">/newbot</span> and
                          follow the steps
                        </li>
                        <li>Copy the bot token and paste it below</li>
                      </ol>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={telegramToken}
                        onChange={(e) => setTelegramToken(e.target.value)}
                        placeholder="123456:ABC-DEF1234..."
                        className="w-full font-mono text-[13px]"
                      />
                      {telegramError && (
                        <p className="flex items-center gap-1.5 text-[12px] text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {telegramError}
                        </p>
                      )}
                      <button
                        onClick={handleConnectTelegram}
                        disabled={telegramLoading}
                        className="btn-primary w-full justify-center py-2 text-[13px]"
                      >
                        {telegramLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Connect Telegram'
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="btn-ghost text-[14px]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGoToSummary}
                  className="text-[13px] text-stone-500 hover:text-stone-700 transition-colors"
                >
                  Skip for now
                </button>
                {telegramConnected && (
                  <button
                    onClick={handleGoToSummary}
                    className="btn-primary px-8 py-2.5 text-[14px]"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 5 — All Done! */}
        {/* ======================================================== */}
        {currentStep === 5 && (
          <div className="animate-fadeIn">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                <Check className="h-8 w-8 text-teal-700" />
              </div>
              <h2 className="mb-2 text-[28px] font-medium tracking-[-0.5px] text-stone-900">
                Your clinic is set up! 🎉
              </h2>
              <p className="text-[14px] text-stone-500">
                Here&rsquo;s a summary of what we&rsquo;ve configured.
              </p>
            </div>

            {/* Checklist */}
            <div
              className="mx-auto max-w-md rounded-xl bg-white p-6"
              style={{ border: '0.5px solid #e7e5e4' }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <span className="text-[14px] text-stone-700">
                    Clinic profile created
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <span className="text-[14px] text-stone-700">
                    {summary.serviceCount} services loaded
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <span className="text-[14px] text-stone-700">
                    Welcome promotion active
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <span className="text-[14px] text-stone-700">
                    {summary.faqCount} FAQ items ready
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      summary.telegramConnected
                        ? 'bg-emerald-100'
                        : 'bg-teal-100'
                    }`}
                  >
                    {summary.telegramConnected ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 text-teal-600" />
                    )}
                  </div>
                  <span className="text-[14px] text-stone-700">
                    Telegram:{' '}
                    {summary.telegramConnected
                      ? `connected (@${summary.telegramUsername})`
                      : 'not yet connected'}
                  </span>
                </div>
              </div>
            </div>

            {/* What to do next */}
            <div className="mx-auto mt-8 max-w-md">
              <h3 className="mb-4 text-[14px] font-medium text-stone-700">
                What to do next
              </h3>
              <div className="space-y-3">
                {summary.telegramConnected && (
                  <a
                    href={
                      summary.telegramConnected
                        ? `https://t.me/${summary.telegramUsername}`
                        : '#'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-stone-600 hover:bg-stone-100 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 text-stone-400" />
                    Test your bot
                    <ExternalLink className="ml-auto h-3.5 w-3.5 text-stone-400" />
                  </a>
                )}
                <a
                  href="/dashboard/calendar"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <Calendar className="h-4 w-4 text-stone-400" />
                  Connect Google Calendar
                  <ArrowRight className="ml-auto h-3.5 w-3.5 text-stone-400" />
                </a>
                <a
                  href="/dashboard/templates"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <LayoutTemplate className="h-4 w-4 text-stone-400" />
                  Explore template library
                  <ArrowRight className="ml-auto h-3.5 w-3.5 text-stone-400" />
                </a>
                <a
                  href="/dashboard/billing"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <CreditCard className="h-4 w-4 text-stone-400" />
                  Set up billing
                  <ArrowRight className="ml-auto h-3.5 w-3.5 text-stone-400" />
                </a>
              </div>
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={handleFinish}
                disabled={loading}
                className="btn-primary px-10 py-3 text-[15px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
