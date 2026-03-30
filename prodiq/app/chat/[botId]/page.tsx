'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'

interface Message { role: 'user' | 'assistant'; content: string }
interface Bot { id: string; name: string; welcome_message: string; lead_capture_enabled: boolean; lead_capture_prompt: string; color: string }

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

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault(); if (!input.trim() || loading) return
    const userMsg = input.trim(); setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages); setLoading(true)
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ botId, sessionId, message: userMsg, messages: newMessages.slice(-10) }) })
    const data = await res.json()
    setMessages(prev => [...prev, { role: 'assistant', content: data.answer || 'Sorry, I had trouble responding. Please try again.' }])
    setLoading(false)
  }

  const accent = bot?.color || '#AAFF00'

  if (botLoading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080A0E', color: '#6B7280' }}>Loading...</div>
  if (!bot) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080A0E', color: '#f87171' }}>Bot not found</div>

  return (
    <div style={{ minHeight: '100vh', background: '#080A0E', display: 'flex', flexDirection: 'column', maxWidth: '720px', margin: '0 auto', padding: '0 16px' }}>
      <div style={{ padding: '20px 0 16px', borderBottom: '1px solid #1E2028', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '38px', height: '38px', background: accent, borderRadius: '50%', fontWeight: 900, fontSize: '16px', color: '#080A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>{bot.name[0].toUpperCase()}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>{bot.name}</div>
          <div style={{ fontSize: '11px', color: accent, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, display: 'inline-block' }}></span>
            Online · Powered by Questme.ai
          </div>
        </div>
      </div>

      {!leadCaptured ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px', textAlign: 'center' }}>👋</div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>{bot.lead_capture_prompt || 'Enter your details to start chatting'}</h2>
            <form onSubmit={submitLead} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              <input className="input" placeholder="Your name (optional)" value={leadName} onChange={e => setLeadName(e.target.value)} />
              <input className="input" type="email" placeholder="Your email address" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} required />
              <button className="btn-accent" type="submit" disabled={submittingLead} style={{ width: '100%', justifyContent: 'center', background: accent }}>
                {submittingLead ? 'Starting...' : 'Start chatting →'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.role === 'assistant' && (
                  <div style={{ width: '28px', height: '28px', background: accent, borderRadius: '50%', fontWeight: 900, fontSize: '12px', color: '#080A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px', flexShrink: 0, alignSelf: 'flex-end', fontFamily: 'Outfit, sans-serif' }}>{bot.name[0].toUpperCase()}</div>
                )}
                <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: m.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px', background: m.role === 'user' ? accent : '#0F1117', color: m.role === 'user' ? '#080A0E' : '#F0F0F0', fontWeight: m.role === 'user' ? 600 : 400, fontSize: '14px', lineHeight: 1.6, border: m.role === 'assistant' ? '1px solid #1E2028' : 'none' }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{ width: '28px', height: '28px', background: accent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#080A0E', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>{bot.name[0].toUpperCase()}</div>
                <div style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px 16px 16px 2px', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    {[0, 1, 2].map(n => <div key={n} style={{ width: '7px', height: '7px', borderRadius: '50%', background: accent, animation: `bounce 1.4s ease-in-out ${n * 0.2}s infinite` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: '16px 0 24px' }}>
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '12px', padding: '8px 8px 8px 16px' }}>
              <input className="input" style={{ background: 'transparent', border: 'none', padding: '4px 0', flex: 1 }} placeholder="Ask me anything..." value={input} onChange={e => setInput(e.target.value)} disabled={loading} />
              <button type="submit" disabled={loading || !input.trim()} style={{ width: '36px', height: '36px', background: input.trim() ? accent : '#1E2028', borderRadius: '8px', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5l7 7-7 7M5 12h14" stroke={input.trim() ? '#080A0E' : '#4B5563'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
