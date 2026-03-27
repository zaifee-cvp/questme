// app/dashboard/telegram/page.tsx
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  Check,
  Pencil,
  Globe,
  BookOpen,
} from 'lucide-react'
import { DemoChat } from '@/components/dashboard/DemoChat'
import Link from 'next/link'

export default function TelegramPage() {
  const supabase = useMemo(() => createClient(), [])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [confirmingDisconnect, setConfirmingDisconnect] = useState(false)
  const [connected, setConnected] = useState(false)
  const [botToken, setBotToken] = useState('')
  const [editToken, setEditToken] = useState('')
  const [botUsername, setBotUsername] = useState('')
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [hasContent, setHasContent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedWebhook, setCopiedWebhook] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''
  const webhookUrl = businessId
    ? `${appUrl}/api/telegram/webhook/${businessId}`
    : ''

  const loadData = useCallback(async () => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id')
      .single()
    if (!profile?.business_id) return

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

    const { count: serviceCount } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', profile.business_id)
      .eq('is_active', true)

    setHasContent((serviceCount || 0) > 0)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!botToken.trim()) return
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch('/api/telegram/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: botToken.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setConnected(true)
        setBotUsername(data.username || '')
        setMessage({
          type: 'success',
          text: 'Telegram bot connected and webhook set!',
        })
        setBotToken('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Setup failed' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Connection error' })
    } finally {
      setSaving(false)
    }
  }

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editToken.trim()) return
    setSaving(true)
    setEditError(null)

    try {
      const res = await fetch('/api/telegram/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: editToken.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setBotUsername(data.username || '')
        setEditing(false)
        setEditToken('')
        setMessage({
          type: 'success',
          text: 'Bot token updated successfully!',
        })
      } else {
        setEditError(data.error || 'Failed to update token')
      }
    } catch {
      setEditError('Connection error')
    } finally {
      setSaving(false)
    }
  }

  const handleDisconnect = async () => {
    if (!businessId) return

    setDisconnecting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/telegram/disconnect', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Failed to disconnect webhook' })
        return
      }

      setConnected(false)
      setBotUsername('')
      setBotToken('')
      setEditing(false)
      setConfirmingDisconnect(false)
      setMessage({
        type: 'success',
        text: 'Telegram bot disconnected.',
      })
    } catch {
      setMessage({ type: 'error', text: 'Failed to disconnect' })
    } finally {
      setDisconnecting(false)
    }
  }

  const copyBotLink = () => {
    if (botUsername) {
      navigator.clipboard.writeText(`https://t.me/${botUsername}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopiedWebhook(true)
    setTimeout(() => setCopiedWebhook(false), 2000)
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
      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-[13px] animate-fadeIn ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
          style={{ border: '0.5px solid' }}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {message.text}
        </div>
      )}

      {/* Connection card */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#229ED9]/10">
            <Send className="h-6 w-6 text-[#229ED9]" />
          </div>
          <div className="flex-1">
            <h2 className="text-[15px] font-medium text-stone-800">
              Telegram Bot
            </h2>
            <p className="text-[13px] text-stone-400">
              {connected
                ? `@${botUsername} is active`
                : 'Not connected'}
            </p>
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${
              connected
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-600'
            }`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                connected ? 'bg-emerald-500' : 'bg-red-400'
              }`}
            />
            {connected ? 'Connected' : 'Not Connected'}
          </div>
        </div>

        {connected && botUsername && (
          <div className="mt-5 space-y-3">
            {/* Bot link */}
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-stone-50 px-3 py-2 text-[12px] text-stone-600">
                https://t.me/{botUsername}
              </code>
              <button
                onClick={copyBotLink}
                className="flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2 text-[12px] text-stone-600 hover:bg-stone-50 transition-colors"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Webhook URL */}
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-lg bg-stone-50 px-3 py-2">
                <Globe className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                <code className="truncate text-[12px] text-stone-500">
                  {webhookUrl}
                </code>
              </div>
              <button
                onClick={copyWebhookUrl}
                className="flex items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2 text-[12px] text-stone-600 hover:bg-stone-50 transition-colors"
              >
                {copiedWebhook ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedWebhook ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setEditing(!editing)
                  setEditToken('')
                  setEditError(null)
                  setConfirmingDisconnect(false)
                }}
                className="flex items-center gap-1.5 rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Bot Token
              </button>
              {!confirmingDisconnect ? (
                <button
                  onClick={() => setConfirmingDisconnect(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 hover:bg-red-100 transition-colors"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Disconnect
                </button>
              ) : (
                <>
                  <button
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                    className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {disconnecting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    Yes, disconnect
                  </button>
                  <button
                    onClick={() => setConfirmingDisconnect(false)}
                    className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit token form */}
      {connected && editing && (
        <form
          onSubmit={handleEditSave}
          className="space-y-4 rounded-2xl bg-white p-6 animate-fadeIn"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <h3 className="text-[14px] font-medium text-stone-800">
            Update Bot Token
          </h3>
          {editError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">
              <XCircle className="h-4 w-4 shrink-0" />
              {editError}
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
              New Bot Token
            </label>
            <input
              type="password"
              value={editToken}
              onChange={(e) => setEditToken(e.target.value)}
              placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
              required
              className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#229ED9]"
              style={{ border: '0.5px solid #e7e5e4' }}
            />
            <p className="mt-1 text-[11px] text-stone-400">
              The old webhook will be removed and a new one registered.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Save New Token
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false)
                setEditToken('')
                setEditError(null)
              }}
              className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Setup form */}
      {!connected && (
        <form
          onSubmit={handleSetup}
          className="space-y-5 rounded-2xl bg-white p-6"
          style={{ border: '0.5px solid #e7e5e4' }}
        >
          <h3 className="text-[14px] font-medium text-stone-800">
            Connect Your Bot
          </h3>
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-stone-600">
              Bot Token
            </label>
            <input
              type="password"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
              required
              className="w-full rounded-lg bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-[#229ED9]"
              style={{ border: '0.5px solid #e7e5e4' }}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#229ED9] py-2.5 text-[13px] font-medium text-white hover:bg-[#1e8ec4] transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            ) : (
              'Connect Telegram Bot'
            )}
          </button>
        </form>
      )}

      {/* BotFather instructions */}
      <div
        className="rounded-2xl bg-white p-6"
        style={{ border: '0.5px solid #e7e5e4' }}
      >
        <h3 className="mb-3 text-[14px] font-medium text-stone-800">
          How to Create a Telegram Bot
        </h3>
        <ol className="space-y-2 text-[13px] text-stone-600">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[11px] font-medium text-sky-700">
              1
            </span>
            Open Telegram and search for @BotFather
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[11px] font-medium text-sky-700">
              2
            </span>
            Send /newbot and follow the prompts to name your bot
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[11px] font-medium text-sky-700">
              3
            </span>
            Copy the bot token BotFather gives you
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[11px] font-medium text-sky-700">
              4
            </span>
            Paste the token above and click Connect
          </li>
        </ol>
        <Link
          href="/dashboard/settings/telegram"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-2 text-[12px] font-medium text-[#229ED9] hover:bg-sky-100 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Open full setup guide with visuals
        </Link>
      </div>

      {/* Demo Chat */}
      {connected && (
        <div>
          <h3 className="mb-3 text-[14px] font-medium text-stone-800">
            Test Your AI Receptionist
          </h3>
          <DemoChat hasContent={hasContent} channel="telegram" />
        </div>
      )}
    </div>
  )
}
