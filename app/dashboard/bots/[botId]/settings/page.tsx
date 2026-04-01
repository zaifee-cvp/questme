'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'

interface Bot {
  id: string
  name: string
  description: string
  welcome_message: string
  fallback_message: string
  color: string
  lead_capture_enabled: boolean
  lead_capture_prompt: string
  handoff_enabled: boolean
  handoff_email: string
  handoff_trigger_keywords: string[]
  restrict_to_knowledge: boolean
  contact_phone: string
  contact_whatsapp: string
  contact_email: string
  contact_website: string
  contact_instagram: string
  contact_facebook: string
  contact_address: string
}

const EMPTY_BOT: Bot = {
  id: '', name: '', description: '', welcome_message: '', fallback_message: '',
  color: '#AAFF00', lead_capture_enabled: false, lead_capture_prompt: '',
  handoff_enabled: false, handoff_email: '', handoff_trigger_keywords: [],
  restrict_to_knowledge: true, contact_phone: '', contact_whatsapp: '',
  contact_email: '', contact_website: '', contact_instagram: '',
  contact_facebook: '', contact_address: '',
}

const INPUT = { background: '#0F1117', border: '1px solid #2D3148', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F0F0F0', width: '100%', outline: 'none', fontFamily: 'DM Sans, sans-serif' } as const
const LABEL = { fontSize: '13px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px', display: 'block' } as const
const SECTION = { background: '#0F1117', border: '1px solid #1E2028', borderRadius: '14px', padding: '28px', marginBottom: '20px' } as const
const SECTION_TITLE = { fontSize: '16px', fontWeight: 700, marginBottom: '20px', fontFamily: 'Outfit, sans-serif', color: '#F0F0F0' } as const

export default function BotSettingsPage() {
  const { botId } = useParams<{ botId: string }>()
  const router = useRouter()
  const [bot, setBot] = useState<Bot>(EMPTY_BOT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [keywordsInput, setKeywordsInput] = useState('')

  const fetchBot = useCallback(async () => {
    const res = await fetch(`/api/bots/${botId}`)
    if (res.ok) {
      const data = await res.json()
      setBot({ ...EMPTY_BOT, ...data })
      setKeywordsInput((data.handoff_trigger_keywords || []).join(', '))
    }
    setLoading(false)
  }, [botId])

  useEffect(() => { fetchBot() }, [fetchBot])

  function set(field: keyof Bot, value: unknown) {
    setBot(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setSaved(false); setError(null)
    const keywords = keywordsInput.split(',').map(k => k.trim()).filter(Boolean)
    const payload = { ...bot, handoff_trigger_keywords: keywords }
    const res = await fetch(`/api/bots/${botId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      const err = await res.json().catch(() => ({ error: 'Save failed' }))
      setError(err.error || 'Save failed')
    }
    setSaving(false)
  }

  async function handleDelete() {
    setDeleting(true)
    const res = await fetch(`/api/bots/${botId}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/dashboard')
    } else {
      setError('Failed to delete bot')
      setDeleting(false)
      setDeleteConfirm(false)
    }
  }

  if (loading) return (
    <div style={{ color: '#6B7280', fontSize: '14px', padding: '40px' }}>Loading...</div>
  )

  return (
    <div style={{ maxWidth: '720px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Link href={`/dashboard/bots/${botId}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to bot
        </Link>
        <span style={{ color: '#2D3148' }}>|</span>
        <h1 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: 0 }}>Bot Settings</h1>
      </div>

      {error && (
        <div style={{ background: '#1a0a0a', border: '1px solid #f87171', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#f87171', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>

        {/* General */}
        <div style={SECTION}>
          <div style={SECTION_TITLE}>General</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={LABEL}>Bot Name</label>
              <input style={INPUT} value={bot.name} onChange={e => set('name', e.target.value)} required placeholder="My Product Bot" />
            </div>
            <div>
              <label style={LABEL}>Description</label>
              <input style={INPUT} value={bot.description} onChange={e => set('description', e.target.value)} placeholder="Optional internal note" />
            </div>
            <div>
              <label style={LABEL}>Welcome Message</label>
              <textarea style={{ ...INPUT, minHeight: '80px', resize: 'vertical' }} value={bot.welcome_message} onChange={e => set('welcome_message', e.target.value)} placeholder="Hi! How can I help you today?" />
            </div>
            <div>
              <label style={LABEL}>Fallback Message <span style={{ fontWeight: 400, color: '#6B7280' }}>(shown when bot cannot answer)</span></label>
              <textarea style={{ ...INPUT, minHeight: '80px', resize: 'vertical' }} value={bot.fallback_message} onChange={e => set('fallback_message', e.target.value)} placeholder="I am not sure about that. Please contact us directly." />
            </div>
            <div>
              <label style={LABEL}>Accent Colour</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="color" value={bot.color} onChange={e => set('color', e.target.value)}
                  style={{ width: '48px', height: '36px', border: '1px solid #2D3148', borderRadius: '6px', background: 'none', cursor: 'pointer', padding: '2px' }} />
                <input style={{ ...INPUT, width: '120px' }} value={bot.color} onChange={e => set('color', e.target.value)} placeholder="#AAFF00" />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="checkbox" id="restrict" checked={bot.restrict_to_knowledge} onChange={e => set('restrict_to_knowledge', e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#AAFF00', cursor: 'pointer' }} />
              <label htmlFor="restrict" style={{ fontSize: '13px', color: '#D1D5DB', cursor: 'pointer' }}>
                Restrict answers to uploaded knowledge only
              </label>
            </div>
          </div>
        </div>

        {/* Lead Capture */}
        <div style={SECTION}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={SECTION_TITLE as any}>Lead Capture</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div style={{ position: 'relative', width: '36px', height: '20px' }}>
                <input type="checkbox" checked={bot.lead_capture_enabled} onChange={e => set('lead_capture_enabled', e.target.checked)} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', background: bot.lead_capture_enabled ? '#AAFF00' : '#2D3148', transition: 'background 0.2s', cursor: 'pointer' }} onClick={() => set('lead_capture_enabled', !bot.lead_capture_enabled)} />
                <div style={{ position: 'absolute', top: '2px', left: bot.lead_capture_enabled ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: bot.lead_capture_enabled ? '#080A0E' : '#6B7280', transition: 'left 0.2s', pointerEvents: 'none' }} />
              </div>
              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{bot.lead_capture_enabled ? 'On' : 'Off'}</span>
            </label>
          </div>
          {bot.lead_capture_enabled && (
            <div>
              <label style={LABEL}>Lead Capture Prompt</label>
              <input style={INPUT} value={bot.lead_capture_prompt} onChange={e => set('lead_capture_prompt', e.target.value)} placeholder="Enter your email to continue chatting" />
            </div>
          )}
        </div>

        {/* Human Handoff */}
        <div style={SECTION}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={SECTION_TITLE as any}>Human Handoff</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div style={{ position: 'relative', width: '36px', height: '20px' }}>
                <input type="checkbox" checked={bot.handoff_enabled} onChange={e => set('handoff_enabled', e.target.checked)} style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', background: bot.handoff_enabled ? '#AAFF00' : '#2D3148', transition: 'background 0.2s', cursor: 'pointer' }} onClick={() => set('handoff_enabled', !bot.handoff_enabled)} />
                <div style={{ position: 'absolute', top: '2px', left: bot.handoff_enabled ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: bot.handoff_enabled ? '#080A0E' : '#6B7280', transition: 'left 0.2s', pointerEvents: 'none' }} />
              </div>
              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{bot.handoff_enabled ? 'On' : 'Off'}</span>
            </label>
          </div>
          {bot.handoff_enabled && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={LABEL}>Notification Email</label>
                <input type="email" style={INPUT} value={bot.handoff_email} onChange={e => set('handoff_email', e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label style={LABEL}>Trigger Keywords <span style={{ fontWeight: 400, color: '#6B7280' }}>(comma-separated)</span></label>
                <input style={INPUT} value={keywordsInput} onChange={e => setKeywordsInput(e.target.value)} placeholder="speak to someone, human, agent" />
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '6px' }}>When a visitor types any of these phrases, your team gets notified by email.</p>
              </div>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div style={SECTION}>
          <div style={SECTION_TITLE}>Contact Information <span style={{ fontSize: '12px', fontWeight: 400, color: '#6B7280' }}>(shown to the bot for answering contact questions)</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {[
              { field: 'contact_phone', label: 'Phone', placeholder: '+1 555 000 0000' },
              { field: 'contact_whatsapp', label: 'WhatsApp', placeholder: '+1 555 000 0000' },
              { field: 'contact_email', label: 'Email', placeholder: 'support@example.com' },
              { field: 'contact_website', label: 'Website', placeholder: 'https://example.com' },
              { field: 'contact_instagram', label: 'Instagram', placeholder: '@handle' },
              { field: 'contact_facebook', label: 'Facebook', placeholder: 'facebook.com/page' },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label style={LABEL}>{label}</label>
                <input style={INPUT} value={(bot as any)[field] || ''} onChange={e => set(field as keyof Bot, e.target.value)} placeholder={placeholder} />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={LABEL}>Address</label>
              <input style={INPUT} value={bot.contact_address || ''} onChange={e => set('contact_address', e.target.value)} placeholder="123 Main St, City, Country" />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <button type="submit" disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '14px', padding: '12px 28px', borderRadius: '10px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'Outfit, sans-serif' }}>
            <Save size={15} />{saving ? 'Saving…' : 'Save Settings'}
          </button>
          {saved && <span style={{ fontSize: '13px', color: '#AAFF00' }}>✓ Saved</span>}
        </div>

      </form>

      {/* Danger Zone */}
      <div style={{ background: '#1a0808', border: '1px solid #3d1515', borderRadius: '14px', padding: '28px' }}>
        <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', fontFamily: 'Outfit, sans-serif', color: '#f87171' }}>Danger Zone</div>
        <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>Permanently delete this bot and all its knowledge. This cannot be undone.</p>
        {!deleteConfirm ? (
          <button onClick={() => setDeleteConfirm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px solid #f87171', color: '#f87171', fontWeight: 600, fontSize: '13px', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            <Trash2 size={14} /> Delete Bot
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#f87171' }}>Are you sure? This is permanent.</span>
            <button onClick={handleDelete} disabled={deleting}
              style={{ background: '#f87171', color: '#080A0E', fontWeight: 700, fontSize: '13px', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif' }}>
              {deleting ? 'Deleting…' : 'Yes, delete'}
            </button>
            <button onClick={() => setDeleteConfirm(false)}
              style={{ background: 'none', border: '1px solid #2D3148', color: '#9CA3AF', fontSize: '13px', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
