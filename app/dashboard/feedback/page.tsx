'use client'
import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Send, CheckCircle } from 'lucide-react'

const FEEDBACK_TYPES = ['Bug report', 'Feature request', 'General feedback', 'Other']

export default function FeedbackPage() {
  const [type, setType] = useState('General feedback')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    async function getUser() {
      const supabase = createSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setUserEmail(user.email)
    }
    getUser()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message }),
      })
      const data = await res.json()
      if (data.success) { setSubmitted(true) }
      else { setError('Failed to send. Please try again.') }
    } catch { setError('Network error. Please try again.') }
    setLoading(false)
  }

  const INPUT = { background: '#080A0E', border: '1px solid #2D3148', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: '#F0F0F0', width: '100%', outline: 'none', fontFamily: 'DM Sans, sans-serif' } as const
  const LABEL = { fontSize: '13px', fontWeight: 600, color: '#9CA3AF', marginBottom: '6px', display: 'block' } as const

  if (submitted) {
    return (
      <div style={{ maxWidth: '480px' }}>
        <div style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', background: '#AAFF0015', border: '1px solid #AAFF0030', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={28} style={{ color: '#AAFF00' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: '8px' }}>Thanks for your feedback!</h2>
          <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '28px', lineHeight: 1.6 }}>We read every submission and use it to improve Questme.ai.</p>
          <button onClick={() => { setSubmitted(false); setMessage('') }}
            style={{ background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '14px', padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
            Send another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '480px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: '6px' }}>Feedback</h1>
        <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Help us improve Questme.ai — every message is read by our team</p>
      </div>

      <div style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '14px', padding: '28px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{ background: '#1a0a0a', border: '1px solid #f8717150', borderRadius: '8px', padding: '12px 14px', fontSize: '13px', color: '#f87171' }}>
              {error}
            </div>
          )}
          <div>
            <label style={LABEL}>Type</label>
            <select value={type} onChange={e => setType(e.target.value)} style={{ ...INPUT, cursor: 'pointer' }}>
              {FEEDBACK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={LABEL}>Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} required
              placeholder="Tell us what's on your mind..."
              style={{ ...INPUT, resize: 'vertical', minHeight: '120px' }} />
          </div>
          {userEmail && (
            <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '-8px' }}>Sending as {userEmail}</p>
          )}
          <button type="submit" disabled={loading || !message.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '14px', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: loading || !message.trim() ? 'not-allowed' : 'pointer', opacity: loading || !message.trim() ? 0.6 : 1, fontFamily: 'Outfit, sans-serif', width: 'fit-content' }}>
            <Send size={15} />
            {loading ? 'Sending...' : 'Send feedback'}
          </button>
        </form>
      </div>
    </div>
  )
}
