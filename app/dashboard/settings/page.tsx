'use client'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [sendingFeedback, setSendingFeedback] = useState(false)
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const router = useRouter()

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.updateUser({ password })
    setMsg(error ? error.message : 'Password updated successfully!')
    setSaving(false); setPassword('')
  }

  async function sendFeedback(e: React.FormEvent) {
    e.preventDefault()
    if (!feedbackMsg.trim()) return
    setSendingFeedback(true); setFeedbackStatus('idle')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'general', message: feedbackMsg }),
      })
      if (res.ok) { setFeedbackStatus('success'); setFeedbackMsg('') }
      else setFeedbackStatus('error')
    } catch {
      setFeedbackStatus('error')
    }
    setSendingFeedback(false)
  }

  async function signOut() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div style={{ maxWidth: '480px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Settings</h1>
      </div>
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>Change password</h3>
        <form onSubmit={updatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="relative">
            <input className="input pr-10" type={showPassword ? 'text' : 'password'} placeholder="New password (8+ characters)" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} style={{ width: '100%' }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#AAFF00] transition-colors" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {msg && <div style={{ fontSize: '13px', color: msg.includes('success') ? '#4ade80' : '#f87171' }}>{msg}</div>}
          <button className="btn-accent" type="submit" disabled={saving} style={{ width: 'fit-content' }}>{saving ? 'Saving...' : 'Update password'}</button>
        </form>
      </div>
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>Send Feedback</h3>
        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '14px' }}>Have a suggestion or found an issue? We&apos;d love to hear from you.</p>
        <form onSubmit={sendFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <textarea
            className="input"
            placeholder="Describe your issue or suggestion..."
            value={feedbackMsg}
            onChange={e => { setFeedbackMsg(e.target.value); setFeedbackStatus('idle') }}
            disabled={sendingFeedback}
            style={{ minHeight: '90px', resize: 'vertical', fontSize: '14px' }}
          />
          {feedbackStatus === 'success' && (
            <div style={{ fontSize: '13px', color: '#4ade80' }}>✓ Feedback sent! We&apos;ll reply within 24 hours.</div>
          )}
          {feedbackStatus === 'error' && (
            <div style={{ fontSize: '13px', color: '#f87171' }}>Failed to send. Please email zaifee@cvidsproductions.net directly.</div>
          )}
          <button
            type="submit"
            disabled={sendingFeedback || !feedbackMsg.trim()}
            style={{ alignSelf: 'flex-start', padding: '9px 22px', background: '#AAFF00', color: '#080A0E', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', opacity: sendingFeedback || !feedbackMsg.trim() ? 0.6 : 1, fontFamily: 'Outfit, sans-serif' }}
          >
            {sendingFeedback ? 'Sending…' : 'Send Feedback →'}
          </button>
        </form>
      </div>
      <div className="card">
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Sign out</h3>
        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '14px' }}>You will be redirected to the homepage.</p>
        <button className="btn-ghost" onClick={signOut}>Sign out</button>
      </div>
    </div>
  )
}
