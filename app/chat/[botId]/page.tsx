'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import ChromeBanner from '@/components/ChromeBanner'

interface Message { role: 'user' | 'assistant'; content: string }
interface Bot { id: string; name: string; welcome_message: string; lead_capture_enabled: boolean; lead_capture_prompt: string; color: string; contact_phone?: string; contact_whatsapp?: string; contact_email?: string; contact_address?: string; contact_website?: string; contact_instagram?: string; contact_facebook?: string; white_label?: boolean }

export default function ChatPage() {
  const { botId } = useParams<{ botId: string }>()
  const [bot, setBot] = useState<Bot | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [botLoading, setBotLoading] = useState(true)
  const [sessionId, setSessionId] = useState('')
  const [leadCaptured, setLeadCaptured] = useState(false)
  const [leadEmail, setLeadEmail] = useState('')
  const [leadName, setLeadName] = useState('')
  const [submittingLead, setSubmittingLead] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadPhone, setLeadPhone] = useState('')
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [leadError, setLeadError] = useState('')
  const [triggerMessage, setTriggerMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      const botRes = await fetch(`/api/bots/public/${botId}`)
      if (!botRes.ok) { setBotLoading(false); return }
      const botData = await botRes.json()
      setBot(botData)
      const sessRes = await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ botId }) })
      const sessData = await sessRes.json()
      setSessionId(sessData.sessionId)
      if (!botData.lead_capture_enabled) {
        setLeadCaptured(true)
        setMessages([{ role: 'assistant', content: botData.welcome_message }])
      }
      setBotLoading(false)
    }
    init()
  }, [botId])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  async function submitLead(e: React.FormEvent) {
    e.preventDefault(); if (!leadEmail) return; setSubmittingLead(true)
    await fetch(`/api/leads/${botId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: leadEmail, name: leadName, sessionId }) })
    setLeadCaptured(true)
    setMessages([{ role: 'assistant', content: bot?.welcome_message || 'Hi! How can I help?' }])
    setSubmittingLead(false)
  }

  const cannotAnswerPhrases = [
    "i don't have information",
    "i don't know",
    "i cannot find",
    "not sure about",
    "don't have details",
    "unable to find",
    "no information",
    "cannot answer",
    "outside my knowledge",
    "not in my knowledge",
    "recommend contacting",
    "please contact",
    "reach out to",
  ]

  function checkIfBotCantAnswer(response: string): boolean {
    const lower = response.toLowerCase()
    return cannotAnswerPhrases.some(phrase => lower.includes(phrase))
  }

  async function sendMessage(e: React.FormEvent | React.MouseEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ botId, sessionId, message: userMsg, messages: newMessages.slice(-10) }),
    })
    const data = await res.json()
    const botAnswer = data.answer || 'Sorry, I had trouble responding. Please try again.'
    setMessages(prev => [...prev, { role: 'assistant', content: botAnswer }])
    setLoading(false)
    if (!showLeadForm && !leadSubmitted && checkIfBotCantAnswer(botAnswer)) {
      setTriggerMessage(userMsg)
      setTimeout(() => setShowLeadForm(true), 1500)
    }
  }

  const accent = bot?.color || '#AAFF00'

  if (botLoading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080A0E', color: '#6B7280' }}>Loading...</div>
  )
  if (!bot) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080A0E', color: '#f87171' }}>Bot not found</div>
  )

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080A0E; overflow: hidden; }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        .chat-page {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          background: #080A0E;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .chat-header {
          padding: 12px 16px;
          border-bottom: 1px solid #1E2028;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #080A0EF0;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          flex-shrink: 0;
          min-height: 60px;
        }
        .chat-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-weight: 900;
          font-size: 15px;
          color: #080A0E;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: 'Outfit', sans-serif;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        .msg-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }
        .msg-row.user { justify-content: flex-end; }
        .msg-row.bot { justify-content: flex-start; }
        .msg-bubble {
          max-width: min(78%, 340px);
          padding: 10px 14px;
          font-size: 14px;
          line-height: 1.55;
          word-break: break-word;
        }
        .msg-bubble.user {
          background: var(--accent);
          color: #080A0E;
          font-weight: 600;
          border-radius: 18px 18px 4px 18px;
        }
        .msg-bubble.bot {
          background: #0F1117;
          color: #F0F0F0;
          border: 1px solid #1E2028;
          border-radius: 18px 18px 18px 4px;
        }
        .msg-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 900;
          color: #080A0E;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: 'Outfit', sans-serif;
        }
        .typing-dots {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 12px 16px;
        }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          animation: bounce 1.4s ease-in-out infinite;
        }
        .chat-input-area {
          padding: 10px 12px;
          background: #080A0E;
          border-top: 1px solid #1E2028;
          flex-shrink: 0;
          padding-bottom: max(10px, env(safe-area-inset-bottom));
        }
        .input-row {
          display: flex;
          gap: 8px;
          align-items: center;
          background: #0F1117;
          border: 1px solid #1E2028;
          border-radius: 24px;
          padding: 6px 6px 6px 14px;
        }
        .input-row:focus-within { border-color: var(--accent); }
        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #F0F0F0;
          font-size: 16px;
          font-family: inherit;
          line-height: 1.4;
          padding: 4px 0;
          min-height: 28px;
          max-height: 100px;
          resize: none;
          -webkit-appearance: none;
        }
        .chat-input::placeholder { color: #4B5563; }
        .send-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          flex-shrink: 0;
        }
        .send-btn:active { transform: scale(0.92); }
        .contact-bar {
          padding: 10px 16px;
          padding-bottom: max(10px, env(safe-area-inset-bottom));
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          border-top: 1px solid #1E2028;
          background: #080A0E;
          flex-shrink: 0;
        }
        .contact-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 20px;
          font-weight: 500;
          white-space: nowrap;
          min-height: 36px;
        }
        .lead-card {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }
        .lead-inner {
          width: 100%;
          max-width: 360px;
          background: #0F1117;
          border: 1px solid #1E2028;
          border-radius: 16px;
          padding: 24px 20px;
        }
        .lead-input {
          width: 100%;
          background: #161820;
          border: 1px solid #1E2028;
          border-radius: 10px;
          padding: 12px 14px;
          color: #F0F0F0;
          font-size: 16px;
          font-family: inherit;
          outline: none;
          -webkit-appearance: none;
          margin-bottom: 10px;
        }
        .lead-input:focus { border-color: var(--accent); }
        .lead-input::placeholder { color: #4B5563; }
        .lead-btn {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.15s;
        }
        .lead-btn:disabled { opacity: 0.6; }
        @media (max-width: 480px) {
          .msg-bubble { max-width: 85%; font-size: 14px; }
          .chat-header { padding: 10px 14px; }
          .chat-messages { padding: 12px; gap: 10px; }
        }
      `}</style>
      <div className="chat-page" style={{ '--accent': accent } as React.CSSProperties}>
        <ChromeBanner />

        {/* Header */}
        <div className="chat-header">
          <div className="chat-avatar" style={{ background: accent }}>
            {bot.name[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#F0F0F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bot.name}</div>
            <div style={{ fontSize: '11px', color: accent, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, display: 'inline-block', flexShrink: 0 }}></span>
              {!(bot as any).white_label ? 'Powered by Questme.ai' : 'Online'}
            </div>
          </div>
        </div>

        {/* Lead capture gate */}
        {!leadCaptured ? (
          <div className="lead-card">
            <div className="lead-inner">
              <div style={{ fontSize: '28px', textAlign: 'center', marginBottom: '10px' }}>👋</div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, textAlign: 'center', color: '#F0F0F0', marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>
                {bot.lead_capture_prompt || 'Enter your details to start chatting'}
              </h2>
              <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', marginBottom: '20px' }}>Takes less than 10 seconds</p>
              <input className="lead-input" placeholder="Your name (optional)" value={leadName} onChange={e => setLeadName(e.target.value)} />
              <input className="lead-input" type="email" inputMode="email" placeholder="Your email address" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} />
              <button className="lead-btn" onClick={submitLead} disabled={submittingLead || !leadEmail} style={{ background: accent, color: '#080A0E' }}>
                {submittingLead ? 'Starting...' : 'Start chatting →'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`msg-row ${m.role === 'user' ? 'user' : 'bot'}`}>
                  {m.role === 'assistant' && (
                    <div className="msg-avatar" style={{ background: accent }}>{bot.name[0].toUpperCase()}</div>
                  )}
                  <div className={`msg-bubble ${m.role === 'user' ? 'user' : 'bot'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="msg-row bot">
                  <div className="msg-avatar" style={{ background: accent }}>{bot.name[0].toUpperCase()}</div>
                  <div className="msg-bubble bot">
                    <div className="typing-dots" style={{ padding: '2px 0' }}>
                      {[0, 1, 2].map(n => (
                        <div key={n} className="dot" style={{ background: accent, animationDelay: `${n * 0.2}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {showLeadForm && !leadSubmitted && (
                <div style={{ background: '#0F0F1A', border: '1px solid #AAFF00', borderRadius: 12, padding: 16, margin: '8px 0' }}>
                  <p style={{ color: '#AAFF00', fontSize: 13, fontWeight: 600, margin: '0 0 4px' }}>
                    Want us to follow up with you?
                  </p>
                  <p style={{ color: '#9CA3AF', fontSize: 12, margin: '0 0 12px' }}>
                    Leave your details and we'll get back to you shortly.
                  </p>
                  {leadError && (
                    <p style={{ color: '#F87171', fontSize: 12, margin: '0 0 8px' }}>{leadError}</p>
                  )}
                  <input
                    value={leadName}
                    onChange={e => setLeadName(e.target.value)}
                    placeholder="Your name *"
                    style={{ width: '100%', background: '#080A0E', border: '1px solid #1A1A2E', borderRadius: 6, padding: '8px 10px', color: '#E2E2F0', fontSize: 13, marginBottom: 8, boxSizing: 'border-box', outline: 'none' }}
                  />
                  <input
                    value={leadEmail}
                    onChange={e => setLeadEmail(e.target.value)}
                    placeholder="Email address"
                    type="email"
                    style={{ width: '100%', background: '#080A0E', border: '1px solid #1A1A2E', borderRadius: 6, padding: '8px 10px', color: '#E2E2F0', fontSize: 13, marginBottom: 8, boxSizing: 'border-box', outline: 'none' }}
                  />
                  <input
                    value={leadPhone}
                    onChange={e => setLeadPhone(e.target.value)}
                    placeholder="Phone / WhatsApp"
                    type="tel"
                    style={{ width: '100%', background: '#080A0E', border: '1px solid #1A1A2E', borderRadius: 6, padding: '8px 10px', color: '#E2E2F0', fontSize: 13, marginBottom: 12, boxSizing: 'border-box', outline: 'none' }}
                  />
                  <p style={{ color: '#4B5563', fontSize: 11, margin: '0 0 10px' }}>* Email or phone required</p>
                  <button
                    onClick={async () => {
                      if (!leadName.trim()) { setLeadError('Please enter your name'); return }
                      if (!leadEmail.trim() && !leadPhone.trim()) { setLeadError('Please enter your email or phone number'); return }
                      setLeadError('')
                      const res = await fetch('/api/leads', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          bot_id: botId,
                          session_id: sessionId,
                          name: leadName,
                          email: leadEmail || null,
                          phone: leadPhone || null,
                          trigger_message: triggerMessage,
                        })
                      })
                      if (res.ok) {
                        setLeadSubmitted(true)
                      } else {
                        setLeadError('Something went wrong. Please try again.')
                      }
                    }}
                    style={{ width: '100%', background: '#AAFF00', border: 'none', borderRadius: 6, padding: '9px', color: '#080A0E', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Send My Details →
                  </button>
                </div>
              )}
              {leadSubmitted && (
                <div style={{ background: '#0A1A0A', border: '1px solid #1A3A1A', borderRadius: 12, padding: 16, margin: '8px 0' }}>
                  <p style={{ color: '#AAFF00', fontSize: 13, fontWeight: 600, margin: '0 0 4px' }}>✓ Got it!</p>
                  <p style={{ color: '#9CA3AF', fontSize: 12, margin: 0 }}>We'll be in touch shortly. Thanks for reaching out!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-area">
              <div className="input-row">
                <textarea
                  className="chat-input"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if (input.trim() && !loading) sendMessage(e as any)
                    }
                  }}
                  disabled={loading}
                  rows={1}
                />
                <button
                  className="send-btn"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  style={{ background: input.trim() ? accent : '#1E2028' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5l7 7-7 7M5 12h14" stroke={input.trim() ? '#080A0E' : '#4B5563'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Contact bar */}
            {(bot.contact_whatsapp || bot.contact_phone || bot.contact_email || bot.contact_website) && (
              <div className="contact-bar">
                {bot.contact_whatsapp && (
                  <a href={`https://wa.me/${bot.contact_whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="contact-btn" style={{ background: '#0a1f0a', color: '#4ade80', border: '1px solid #166534' }}>
                    💬 WhatsApp
                  </a>
                )}
                {bot.contact_phone && (
                  <a href={`tel:${bot.contact_phone}`} className="contact-btn" style={{ background: '#0a1628', color: '#60a5fa', border: '1px solid #1e3a5f' }}>
                    📞 Call
                  </a>
                )}
                {bot.contact_email && (
                  <a href={`mailto:${bot.contact_email}`} className="contact-btn" style={{ background: '#150a28', color: '#c084fc', border: '1px solid #4c1d95' }}>
                    ✉️ Email
                  </a>
                )}
                {bot.contact_website && (
                  <a href={bot.contact_website} target="_blank" rel="noreferrer" className="contact-btn" style={{ background: '#0a1400', color: '#AAFF00', border: '1px solid #365314' }}>
                    🌐 Website
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
