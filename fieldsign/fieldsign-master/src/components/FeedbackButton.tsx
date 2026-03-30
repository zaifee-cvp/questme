'use client'
import { useState } from 'react'

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'bug' | 'idea' | 'other'>('idea')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message }),
      })
      setDone(true)
      setTimeout(() => { setDone(false); setOpen(false); setMessage(''); setType('idea') }, 2500)
    } catch {}
    setSending(false)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          background: '#f97316', color: '#fff', border: 'none', borderRadius: '50px',
          padding: '12px 20px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(249,115,22,0.4)',
          display: 'flex', alignItems: 'center', gap: '6px',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        💬 Feedback
      </button>

      {/* Modal */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '340px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0' }}>
            {done ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🙏</div>
                <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>Thank you!</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Your feedback helps us improve FieldSign.</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: '#1e293b' }}>Send Feedback</div>
                  <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#94a3b8' }}>✕</button>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  {(['bug', 'idea', 'other'] as const).map(t => (
                    <button key={t} onClick={() => setType(t)} style={{
                      flex: 1, padding: '7px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
                      borderColor: type === t ? '#f97316' : '#e2e8f0',
                      background: type === t ? '#fff7ed' : '#f8fafc',
                      color: type === t ? '#f97316' : '#64748b',
                    }}>
                      {t === 'bug' ? '🐛 Bug' : t === 'idea' ? '💡 Idea' : '💬 Other'}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleSubmit}>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tell us what's on your mind..."
                    required
                    rows={4}
                    style={{ width: '100%', borderRadius: '10px', border: '1.5px solid #e2e8f0', padding: '10px 12px', fontSize: '13px', color: '#1e293b', resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                  <button type="submit" disabled={sending || !message.trim()} style={{
                    width: '100%', marginTop: '10px', background: '#f97316', color: '#fff',
                    fontWeight: 700, fontSize: '14px', border: 'none', borderRadius: '10px',
                    padding: '11px', cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1,
                  }}>
                    {sending ? 'Sending...' : 'Send Feedback →'}
                  </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#94a3b8' }}>
                  or email us at <a href="mailto:support@fieldsign.io" style={{ color: '#f97316' }}>support@fieldsign.io</a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
