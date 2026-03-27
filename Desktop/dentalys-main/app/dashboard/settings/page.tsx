// app/dashboard/settings/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  SUPPORTED_CURRENCIES,
  SUPPORTED_TIMEZONES,
  SUPPORTED_LANGUAGES,
} from '@/types'
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Send,
  ChevronRight,
  Lock,
  Bot,
} from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savingPersona, setSavingPersona] = useState(false)
  const [savedPersona, setSavedPersona] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [businessId, setBusinessId] = useState<string>('')
  const [plan, setPlan] = useState<string>('free')
  const [botPersonaName, setBotPersonaName] = useState('')

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    currency: 'USD',
    timezone: 'UTC',
    language: 'en',
    welcome_message: '',
    handoff_message: '',
  })

  const loadData = useCallback(async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id')
      .single()
    if (!profile?.business_id) return
    setBusinessId(profile.business_id)

    const [{ data: business }, { data: subscription }] = await Promise.all([
      supabase
        .from('businesses')
        .select(
          'name, tagline, phone, email, address, website, currency, timezone, language, welcome_message, handoff_message, bot_persona_name'
        )
        .eq('id', profile.business_id)
        .single(),
      supabase
        .from('subscriptions')
        .select('plan')
        .eq('business_id', profile.business_id)
        .single(),
    ])

    if (business) {
      setForm({
        name: business.name || '',
        tagline: business.tagline || '',
        phone: business.phone || '',
        email: business.email || '',
        address: business.address || '',
        website: business.website || '',
        currency: business.currency || 'USD',
        timezone: business.timezone || 'UTC',
        language: business.language || 'en',
        welcome_message: business.welcome_message || '',
        handoff_message: business.handoff_message || '',
      })
      setBotPersonaName((business as any).bot_persona_name || '')
    }
    if (subscription) setPlan(subscription.plan || 'free')
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessId) return
    setSaving(true)
    setSaved(false)

    await supabase
      .from('businesses')
      .update({
        name: form.name,
        tagline: form.tagline || null,
        phone: form.phone || null,
        email: form.email || null,
        address: form.address || null,
        website: form.website || null,
        currency: form.currency,
        timezone: form.timezone,
        language: form.language,
        welcome_message: form.welcome_message,
        handoff_message: form.handoff_message,
      })
      .eq('id', businessId)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleSavePersona = async () => {
    if (!businessId) return
    setSavingPersona(true)
    setSavedPersona(false)
    await supabase
      .from('businesses')
      .update({ bot_persona_name: botPersonaName || null })
      .eq('id', businessId)
    setSavingPersona(false)
    setSavedPersona(true)
    setTimeout(() => setSavedPersona(false), 3000)
  }

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    )
      return
    if (
      !confirm(
        'This will permanently delete your business, all data, and cancel your subscription. Continue?'
      )
    )
      return

    setDeleting(true)
    // Sign out and redirect — actual deletion would need a server-side cleanup
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      {/* Integrations quick-links */}
      <div
        className="rounded-2xl bg-white"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <div className="border-b border-stone-100 px-6 py-4">
          <h2 className="text-[14px] font-medium text-stone-800">Channel Setup</h2>
          <p className="mt-0.5 text-[12px] text-stone-400">Configure your messaging channels</p>
        </div>
        <Link
          href="/dashboard/settings/telegram"
          className="flex items-center gap-3 px-6 py-4 hover:bg-stone-50 transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#229ED9]/10">
            <Send className="h-4 w-4 text-[#229ED9]" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-stone-700">Telegram Bot Setup</p>
            <p className="text-[12px] text-stone-400">Step-by-step guide to connect your Telegram bot</p>
          </div>
          <ChevronRight className="h-4 w-4 text-stone-300" />
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Clinic Info */}
        <div
          className="rounded-2xl bg-white p-6"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <h2 className="mb-5 text-[14px] font-medium text-stone-800">
            Clinic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                Business Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                style={{ border: '0.5px solid #e7e5e4' }}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) =>
                  setForm({ ...form, tagline: e.target.value })
                }
                className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                style={{ border: '0.5px solid #e7e5e4' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                  style={{ border: '0.5px solid #e7e5e4' }}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                  style={{ border: '0.5px solid #e7e5e4' }}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                Address
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                style={{ border: '0.5px solid #e7e5e4' }}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                Website
              </label>
              <input
                type="url"
                value={form.website}
                onChange={(e) =>
                  setForm({ ...form, website: e.target.value })
                }
                className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                style={{ border: '0.5px solid #e7e5e4' }}
              />
            </div>
          </div>
        </div>

        {/* Localization */}
        <div
          className="rounded-2xl bg-white p-6"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <h2 className="mb-5 text-[14px] font-medium text-stone-800">
            Localization
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                Currency
              </label>
              <select
                value={form.currency}
                onChange={(e) =>
                  setForm({ ...form, currency: e.target.value })
                }
                className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                style={{ border: '0.5px solid #e7e5e4' }}
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                Timezone
              </label>
              <select
                value={form.timezone}
                onChange={(e) =>
                  setForm({ ...form, timezone: e.target.value })
                }
                className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                style={{ border: '0.5px solid #e7e5e4' }}
              >
                {SUPPORTED_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                Language
              </label>
              <select
                value={form.language}
                onChange={(e) =>
                  setForm({ ...form, language: e.target.value })
                }
                className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                style={{ border: '0.5px solid #e7e5e4' }}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* AI Messages */}
        <div
          className="rounded-2xl bg-white p-6"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <h2 className="mb-5 text-[14px] font-medium text-stone-800">
            AI Messages
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                Welcome Message
              </label>
              <textarea
                value={form.welcome_message}
                onChange={(e) =>
                  setForm({ ...form, welcome_message: e.target.value })
                }
                rows={3}
                placeholder="Hello! Welcome to our clinic. How can I help you today?"
                className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                style={{ border: '0.5px solid #e7e5e4' }}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                Handoff Message
              </label>
              <textarea
                value={form.handoff_message}
                onChange={(e) =>
                  setForm({ ...form, handoff_message: e.target.value })
                }
                rows={3}
                placeholder="Let me connect you with our team. Someone will be with you shortly."
                className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-amber-300"
                style={{ border: '0.5px solid #e7e5e4' }}
              />
            </div>
          </div>
        </div>

        {/* Bot Persona */}
        <div
          className="rounded-2xl bg-white p-6"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <div className="mb-5 flex items-center gap-2">
            <Bot className="h-4 w-4 text-teal-600" />
            <h2 className="text-[14px] font-medium text-stone-800">Bot Persona</h2>
            {plan === 'pro' && (
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-700">Pro</span>
            )}
          </div>

          {plan === 'pro' ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                  Bot Persona Name
                </label>
                <input
                  type="text"
                  value={botPersonaName}
                  onChange={(e) => setBotPersonaName(e.target.value)}
                  placeholder="e.g. Aria, Dental Assistant, Dr. Smith's Assistant"
                  className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-teal-400"
                  style={{ border: '0.5px solid #e7e5e4' }}
                />
                <p className="mt-1.5 text-[12px] text-stone-400">
                  This is how your AI introduces itself to patients on Telegram.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSavePersona}
                  disabled={savingPersona}
                  className="btn-primary flex items-center gap-2 text-[13px]"
                >
                  {savingPersona ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Persona
                    </>
                  )}
                </button>
                {savedPersona && (
                  <span className="flex items-center gap-1.5 text-[12px] text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> Saved
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
                  Bot Persona Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    placeholder="e.g. Aria, Dental Assistant, Dr. Smith's Assistant"
                    className="w-full rounded-lg bg-stone-50 px-3 py-2 pr-10 text-[13px] text-stone-400 cursor-not-allowed"
                    style={{ border: '0.5px solid #e7e5e4' }}
                  />
                  <Lock className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-300" />
                </div>
              </div>
              <p className="mb-3 text-[12px] text-stone-400">
                Upgrade to Pro to customise your bot&apos;s name and give it a unique identity for your clinic.
              </p>
              <Link
                href="/dashboard/billing"
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-teal-600 hover:text-teal-700 transition-colors"
              >
                Upgrade to Pro <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 text-[13px]"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Changes
              </>
            )}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-[12px] text-emerald-600 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4" /> Saved
            </span>
          )}
        </div>
      </form>

      {/* Danger Zone */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #fecaca' }}
      >
        <h2 className="mb-2 flex items-center gap-2 text-[14px] font-medium text-red-700">
          <AlertTriangle className="h-4 w-4" />
          Danger Zone
        </h2>
        <p className="mb-4 text-[13px] text-stone-500">
          Once you delete your account, there is no going back. This will
          permanently delete your business, all data, and cancel your
          subscription.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="rounded-xl bg-red-50 px-4 py-2 text-[13px] font-medium text-red-700 hover:bg-red-100 transition-colors"
          style={{ border: '0.5px solid #fecaca' }}
        >
          {deleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  )
}
