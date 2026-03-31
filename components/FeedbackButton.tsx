'use client'
import { useState } from 'react'

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'bug' | 'feature' | 'general'>('general')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

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
    } catch {}
    setSent(true)
    setSending(false)
    setTimeout(() => { setSent(false); setOpen(false); setMessage('') }, 2000)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: '#AAFF00',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(170, 255, 0, 0.3)',
          zIndex: 1000,
          transition: 'transform 0.2s, box-shadow 0.2s',
          fontSize: '20px',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
        title="Send feedback"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Feedback panel */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '84px',
          right: '24px',
          width: '300px',
          background: '#0F1117',
          border: '1px solid #1E2028',
          borderRadius: '16px',
          padding: '20px',
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'slideUp 0.2s ease',
        }}>
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🙌</div>
              <div style={{ fontWeight: 700, color: '#AAFF00', fontFamily: 'Outfit, sans-serif' }}>Thank you!</div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Your feedback helps us improve.</div>
            </div>
          ) : (
            <>
              <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '14px', fontFamily: 'Outfit, sans-serif', color: '#F0F0F0' }}>Send feedback</div>

              {/* Type selector */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {([
                  { id: 'bug', label: '🐛 Bug' },
                  { id: 'feature', label: '✨ Feature' },
                  { id: 'general', label: '💬 General' },
                ] as const).map(t => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      borderRadius: '8px',
                      border: type === t.id ? '1px solid #AAFF00' : '1px solid #1E2028',
                      background: type === t.id ? '#AAFF0015' : 'transparent',
                      color: type === t.id ? '#AAFF00' : '#6B7280',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      transition: 'all 0.15s',
                    }}
                  >{t.label}</button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <textarea
                  placeholder="Tell us what's on your mind..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    background: '#161820',
                    border: '1px solid #1E2028',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#F0F0F0',
                    fontSize: '13px',
                    fontFamily: 'DM Sans, sans-serif',
                    resize: 'none',
                    outline: 'none',
                    marginBottom: '10px',
                    lineHeight: 1.5,
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#AAFF00' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#1E2028' }}
                />
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  style={{
                    width: '100%',
                    background: message.trim() ? '#AAFF00' : '#1E2028',
                    color: message.trim() ? '#080A0E' : '#4B5563',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: message.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'DM Sans, sans-serif',
                    transition: 'all 0.15s',
                  }}
                >
                  {sending ? 'Sending...' : 'Send feedback →'}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}
