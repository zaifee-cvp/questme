'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  Zap,
  ChevronRight,
} from 'lucide-react'

// ─── Step data ────────────────────────────────────────────────────────────────

const BOTFATHER_STEPS = [
  {
    number: 1,
    title: 'Open Telegram and find BotFather',
    description:
      'Open Telegram on your phone or desktop. In the search bar at the top, type @BotFather and tap the result with the blue verified checkmark.',
    tip: 'BotFather is the official Telegram bot for creating and managing bots. It has a blue ✓ badge.',
    mockup: (
      <div className="rounded-xl bg-[#1c2a3a] p-3 text-[12px]">
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-[#242f3d] px-3 py-2">
          <span className="text-stone-400">🔍</span>
          <span className="text-[#5e9dd6]">@BotFather</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-lg bg-[#2b5278] px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#229ED9] text-[14px]">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-1 font-medium text-white">
              BotFather
              <span className="text-[10px] text-[#5e9dd6]">✓</span>
            </div>
            <div className="text-[11px] text-stone-400">Hi! I will help you create a new bot.</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 2,
    title: 'Start a chat with BotFather',
    description:
      'Tap the START button at the bottom of the chat. BotFather will respond with a list of commands it supports.',
    tip: 'You only need to press Start once. If you have chatted with BotFather before, skip this step.',
    mockup: (
      <div className="rounded-xl bg-[#1c2a3a] p-3 text-[12px]">
        <div className="rounded-lg bg-[#182533] px-3 py-2.5 text-stone-300 leading-relaxed">
          I can help you create and manage Telegram bots. Use these commands:
          <br />
          <span className="text-[#5e9dd6]">/newbot</span> – create a new bot
          <br />
          <span className="text-[#5e9dd6]">/mybots</span> – manage your bots
        </div>
        <div className="mt-2 flex justify-center">
          <div className="rounded-lg bg-[#229ED9] px-8 py-2 text-center text-white">
            START
          </div>
        </div>
      </div>
    ),
  },
  {
    number: 3,
    title: 'Type /newbot',
    description:
      'Type /newbot and send the message. BotFather will ask you to choose a name for your new bot.',
    tip: 'This creates a brand-new Telegram bot linked to your account.',
    mockup: (
      <div className="rounded-xl bg-[#1c2a3a] p-3 text-[12px] space-y-2">
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-tr-sm bg-[#2b5278] px-3 py-2 text-white max-w-[70%]">
            /newbot
          </div>
        </div>
        <div className="rounded-2xl rounded-tl-sm bg-[#182533] px-3 py-2 text-stone-300 max-w-[80%]">
          Alright, a new bot. How are we going to call it? Please choose a name for your bot.
        </div>
      </div>
    ),
  },
  {
    number: 4,
    title: 'Enter your bot\'s display name',
    description:
      'Type a friendly name for your bot — this is what customers will see when they chat with it. It can be anything, like "City Dental Assistant" or "Bella\'s Clinic Bot".',
    tip: 'This name can contain spaces and any characters. It\'s just the display name, not the username.',
    mockup: (
      <div className="rounded-xl bg-[#1c2a3a] p-3 text-[12px] space-y-2">
        <div className="rounded-2xl rounded-tl-sm bg-[#182533] px-3 py-2 text-stone-300 max-w-[80%]">
          Alright, a new bot. How are we going to call it?
        </div>
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-tr-sm bg-[#2b5278] px-3 py-2 text-white max-w-[70%]">
            City Dental Assistant
          </div>
        </div>
        <div className="rounded-2xl rounded-tl-sm bg-[#182533] px-3 py-2 text-stone-300 max-w-[80%]">
          Good. Now let's choose a username for your bot. It must end in <span className="text-[#5e9dd6]">bot</span>.
        </div>
      </div>
    ),
  },
  {
    number: 5,
    title: 'Choose a username ending in _bot',
    description:
      'Type a unique username for your bot. It must end with "bot" — for example "citydental_bot" or "bellaclinic_bot". This becomes the link your customers use to find the bot.',
    tip: 'Usernames must be unique across all of Telegram. If yours is taken, try adding your city or a number.',
    mockup: (
      <div className="rounded-xl bg-[#1c2a3a] p-3 text-[12px] space-y-2">
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-tr-sm bg-[#2b5278] px-3 py-2 text-white max-w-[70%]">
            citydental_bot
          </div>
        </div>
        <div className="rounded-2xl rounded-tl-sm bg-[#182533] px-3 py-2 text-stone-300 max-w-[80%] leading-relaxed">
          Done! Congratulations on your new bot. You will find it at{' '}
          <span className="text-[#5e9dd6]">t.me/citydental_bot</span>.
          <br /><br />
          Use this token to access the HTTP API:
          <br />
          <span className="font-mono text-[#ffd700] break-all">
            7123456789:AAFxxx...
          </span>
          <br /><br />
          Keep your token secure.
        </div>
      </div>
    ),
  },
  {
    number: 6,
    title: 'Copy your bot token',
    description:
      'BotFather will show a long token that looks like "7123456789:AAFxxx...". Tap and hold it to copy the full token, then paste it in the form below.',
    tip: 'Never share this token publicly — it gives full control over your bot. You can always regenerate it from BotFather.',
    mockup: (
      <div className="rounded-xl bg-[#1c2a3a] p-3 text-[12px] space-y-2">
        <div className="rounded-2xl rounded-tl-sm bg-[#182533] px-3 py-2 text-stone-300 max-w-[90%] leading-relaxed">
          Use this token to access the HTTP API:
          <br />
          <span className="font-mono text-[#ffd700] break-all select-all">
            7123456789:AAFxxxYYYzzz_your_actual_token
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 rounded-lg bg-[#2b5278]/50 px-2.5 py-1.5 text-[11px] text-[#5e9dd6]">
          <span>👆</span> Tap and hold to copy this token
        </div>
      </div>
    ),
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function TelegramSetupPage() {
  const supabase = useMemo(() => createClient(), [])

  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [botUsername, setBotUsername] = useState('')
  const [businessId, setBusinessId] = useState<string | null>(null)

  const [token, setToken] = useState('')
  const [showToken, setShowToken] = useState(false)

  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    ok: boolean
    username?: string
    firstName?: string
    error?: string
  } | null>(null)

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [disconnecting, setDisconnecting] = useState(false)
  const [confirmDisconnect, setConfirmDisconnect] = useState(false)

  const [copied, setCopied] = useState(false)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const webhookUrl = businessId
    ? `${appUrl}/api/telegram/webhook/${businessId}`
    : ''

  const loadData = useCallback(async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id')
      .single()
    if (!profile?.business_id) { setLoading(false); return }

    setBusinessId(profile.business_id)

    const { data: business } = await supabase
      .from('businesses')
      .select('telegram_bot_token, telegram_bot_username')
      .eq('id', profile.business_id)
      .single()

    if (business) {
      setConnected(!!business.telegram_bot_token)
      setBotUsername(business.telegram_bot_username || '')
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadData() }, [loadData])

  // ── Token validation ──────────────────────────────────────────────────────

  const handleTest = async () => {
    if (!token.trim()) return
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: token.trim() }),
      })
      const data = await res.json()
      setTestResult(res.ok ? { ok: true, ...data } : { ok: false, error: data.error })
    } catch {
      setTestResult({ ok: false, error: 'Network error — check your connection.' })
    } finally {
      setTesting(false)
    }
  }

  // ── Save & register webhook ──────────────────────────────────────────────

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token.trim()) return
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/telegram/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: token.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setConnected(true)
        setBotUsername(data.username || '')
        setToken('')
        setTestResult(null)
      } else {
        setSaveError(data.error || 'Setup failed. Please try again.')
      }
    } catch {
      setSaveError('Network error — could not connect to Telegram.')
    } finally {
      setSaving(false)
    }
  }

  // ── Disconnect ───────────────────────────────────────────────────────────

  const handleDisconnect = async () => {
    setDisconnecting(true)
    try {
      await fetch('/api/telegram/disconnect', { method: 'POST' })
      setConnected(false)
      setBotUsername('')
      setConfirmDisconnect(false)
    } finally {
      setDisconnecting(false)
    }
  }

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-12">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#229ED9]/10">
          <Send className="h-5 w-5 text-[#229ED9]" />
        </div>
        <div>
          <h1 className="text-[16px] font-semibold text-stone-800">Telegram Bot Setup</h1>
          <p className="text-[12px] text-stone-400">Connect your AI receptionist to Telegram in a few minutes</p>
        </div>
        <div className="ml-auto">
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium ${
              connected
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-stone-100 text-stone-500'
            }`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                connected ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
              }`}
            />
            {connected ? 'Connected' : 'Not Connected'}
          </div>
        </div>
      </div>

      {/* ── Connected state ── */}
      {connected && (
        <div
          className="rounded-2xl bg-white p-5 animate-fadeIn"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            <div className="flex-1">
              <p className="text-[13px] font-medium text-stone-800">
                @{botUsername} is active
              </p>
              <p className="text-[12px] text-stone-400">
                Your AI receptionist is live on Telegram. Customers can message it at{' '}
                <a
                  href={`https://t.me/${botUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#229ED9] hover:underline inline-flex items-center gap-0.5"
                >
                  t.me/{botUsername}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </div>

          {/* Webhook URL */}
          <div className="mt-4">
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-stone-400">
              Webhook URL (auto-configured)
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-stone-50 px-3 py-2 text-[11px] text-stone-500">
                {webhookUrl}
              </code>
              <button
                onClick={copyWebhook}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-[12px] text-stone-600 transition-colors hover:bg-stone-50"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Disconnect */}
          <div className="mt-4 flex items-center gap-2 border-t border-stone-100 pt-4">
            {!confirmDisconnect ? (
              <button
                onClick={() => setConfirmDisconnect(true)}
                className="text-[13px] text-red-500 hover:text-red-700 transition-colors"
              >
                Disconnect bot
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-stone-500">Are you sure?</span>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-[12px] text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {disconnecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  Yes, disconnect
                </button>
                <button
                  onClick={() => setConfirmDisconnect(false)}
                  className="rounded-lg border border-stone-200 px-3 py-1.5 text-[12px] text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Setup guide (always visible) ── */}
      <div
        className="rounded-2xl bg-white"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <div className="border-b border-stone-100 px-6 py-4">
          <h2 className="text-[14px] font-medium text-stone-800">
            {connected ? 'How you set it up' : 'Step-by-step: Create your Telegram bot'}
          </h2>
          <p className="mt-0.5 text-[12px] text-stone-400">
            {connected
              ? 'Reference guide for creating a Telegram bot with BotFather.'
              : 'Follow these 6 steps — takes about 2 minutes. No coding required.'}
          </p>
        </div>

        <div className="divide-y divide-stone-50">
          {BOTFATHER_STEPS.map((step, idx) => (
            <StepRow key={step.number} step={step} isLast={idx === BOTFATHER_STEPS.length - 1} />
          ))}
        </div>
      </div>

      {/* ── Token form ── */}
      {!connected && (
        <form
          onSubmit={handleSave}
          className="space-y-5 rounded-2xl bg-white p-6 animate-fadeIn"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#229ED9]/10">
              <Zap className="h-4 w-4 text-[#229ED9]" />
            </div>
            <h2 className="text-[14px] font-medium text-stone-800">Paste your bot token</h2>
          </div>

          {/* Token input */}
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
              Bot Token <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => { setToken(e.target.value); setTestResult(null); setSaveError(null) }}
                placeholder="7123456789:AAFxxxYYYzzz_your_token_here"
                required
                className="w-full rounded-lg bg-white py-2.5 pl-3 pr-10 font-mono text-[12px] focus:outline-none focus:ring-1 focus:ring-[#229ED9]"
                style={{ border: '0.5px solid #e7e5e4' }}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-stone-400">
              Looks like <span className="font-mono">1234567890:AABBccDDeeff...</span> — copy it exactly from BotFather.
            </p>
          </div>

          {/* Test result */}
          {testResult && (
            <div
              className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-[13px] animate-fadeIn ${
                testResult.ok
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {testResult.ok ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              )}
              <div>
                {testResult.ok ? (
                  <>
                    <p className="font-medium">Token is valid!</p>
                    <p className="text-[12px] text-emerald-700">
                      Bot name: <span className="font-medium">{testResult.firstName}</span>{' '}
                      (@{testResult.username})
                    </p>
                  </>
                ) : (
                  <p>{testResult.error}</p>
                )}
              </div>
            </div>
          )}

          {/* Save error */}
          {saveError && (
            <div className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-700 animate-fadeIn">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {saveError}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {/* Test button */}
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !token.trim()}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 px-4 py-2.5 text-[13px] text-stone-700 hover:bg-stone-50 disabled:opacity-40 transition-colors"
            >
              {testing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-stone-400" />
              )}
              {testing ? 'Checking…' : 'Test Token'}
            </button>

            {/* Connect button */}
            <button
              type="submit"
              disabled={saving || !token.trim()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#229ED9] py-2.5 text-[13px] font-medium text-white hover:bg-[#1e8ec4] disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {saving ? 'Connecting…' : 'Connect & Register Webhook'}
            </button>
          </div>

          <p className="text-[11px] text-stone-400">
            Clicking Connect will validate your token, save it securely, and automatically register the Telegram webhook — no extra configuration needed.
          </p>
        </form>
      )}

      {/* ── Tips card ── */}
      <div
        className="rounded-2xl bg-sky-50 p-5"
        style={{ border: '0.5px solid #bae6fd' }}
      >
        <h3 className="mb-3 text-[13px] font-medium text-sky-800">Helpful tips</h3>
        <ul className="space-y-2">
          {[
            'Your bot token is stored securely and never exposed to customers.',
            'The webhook is registered automatically — customers can message your bot immediately after connecting.',
            'To test: after connecting, open Telegram, find your bot by its username, and send it a message.',
            'If you rename or delete your bot in BotFather, come back here and reconnect with the new token.',
            'You can disconnect at any time. Your conversation history is kept in Dentalys.',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-[12px] text-sky-700">
              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400" />
              {tip}
            </li>
          ))}
        </ul>

        <a
          href="https://core.telegram.org/bots#botfather"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-sky-700 hover:text-sky-800 transition-colors"
        >
          Official BotFather docs <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}

// ─── Step row sub-component ───────────────────────────────────────────────────

function StepRow({
  step,
  isLast,
}: {
  step: (typeof BOTFATHER_STEPS)[number]
  isLast: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`px-6 py-4 ${!isLast ? '' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 text-left"
      >
        {/* Step number */}
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[12px] font-semibold text-[#229ED9]">
          {step.number}
        </div>

        {/* Title */}
        <span className="flex-1 text-[13px] font-medium text-stone-700">
          {step.title}
        </span>

        {/* Expand chevron */}
        <ChevronRight
          className={`h-4 w-4 shrink-0 text-stone-400 transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>

      {open && (
        <div className="mt-4 ml-10 space-y-3 animate-fadeIn">
          {/* Description */}
          <p className="text-[13px] leading-relaxed text-stone-600">{step.description}</p>

          {/* Mockup */}
          <div className="overflow-hidden rounded-xl">{step.mockup}</div>

          {/* Tip */}
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5">
            <span className="text-[13px]">💡</span>
            <p className="text-[12px] text-amber-800">{step.tip}</p>
          </div>
        </div>
      )}
    </div>
  )
}
