'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import ChromeBanner from '@/components/ChromeBanner'

interface Message { role: 'user' | 'assistant'; content: string }
interface Bot { id: string; name: string; welcome_message: string; lead_capture_enabled: boolean; lead_capture_prompt: string; color: string; contact_phone?: string; contact_whatsapp?: string; contact_email?: string; contact_address?: string; contact_website?: string; contact_instagram?: string; contact_facebook?: string; white_label?: boolean }

// Visitor identity is scoped PER BOT (qm_visitor_<botId>) so filling one bot's gate
// never silently skips another bot's gate.
const visitorKey = (botId: string) => `qm_visitor_${botId}`

/**
 * Dial codes offered on the lead form.
 *
 * Curated rather than exhaustive: a 200-entry country list is a worse experience
 * than twelve on a widget this narrow, and these are the markets the bots
 * actually serve. `regions` exists only to match a browser locale — +1 covers
 * both US and CA, and en-UK is a tag people really send even though GB is the
 * correct region subtag.
 */
const DIAL_CODES: { code: string; flag: string; label: string; regions: string[] }[] = [
  { code: '+65', flag: '🇸🇬', label: 'SG', regions: ['SG'] },
  { code: '+60', flag: '🇲🇾', label: 'MY', regions: ['MY'] },
  { code: '+62', flag: '🇮🇩', label: 'ID', regions: ['ID'] },
  { code: '+63', flag: '🇵🇭', label: 'PH', regions: ['PH'] },
  { code: '+66', flag: '🇹🇭', label: 'TH', regions: ['TH'] },
  { code: '+84', flag: '🇻🇳', label: 'VN', regions: ['VN'] },
  { code: '+852', flag: '🇭🇰', label: 'HK', regions: ['HK'] },
  { code: '+61', flag: '🇦🇺', label: 'AU', regions: ['AU'] },
  { code: '+91', flag: '🇮🇳', label: 'IN', regions: ['IN'] },
  { code: '+44', flag: '🇬🇧', label: 'UK', regions: ['GB', 'UK'] },
  { code: '+1', flag: '🇺🇸', label: 'US/CA', regions: ['US', 'CA'] },
  { code: '+971', flag: '🇦🇪', label: 'AE', regions: ['AE'] },
]

const DEFAULT_DIAL_CODE = '+65'

/** The region subtag of a BCP-47 tag: en-SG -> SG, zh-Hans-SG -> SG, en -> null. */
function regionOf(tag: string): string | null {
  const parts = tag.split('-')
  for (let i = 1; i < parts.length; i++) {
    if (/^[A-Za-z]{2}$/.test(parts[i])) return parts[i].toUpperCase()
  }
  return null
}

/**
 * Dial code by IANA time zone, checked BEFORE language.
 *
 * WHERE THE VISITOR IS BEATS WHERE THEIR PHONE IS FROM. An expat in Singapore
 * carrying an en-GB handset is the common case on these bots, and language
 * alone hands them +44 — a number they have to correct on a form we just
 * promised would take ten seconds. Their time zone is Asia/Singapore, which is
 * the better guess by a distance. Language stays as the fallback for the
 * reverse case: a visitor whose zone we do not recognise.
 *
 * Only zones whose dial code exists in DIAL_CODES appear here — a default the
 * select cannot display is worse than no default at all.
 */
const TIMEZONE_DIAL_CODES: Record<string, string> = {
  'Asia/Singapore': '+65',
  'Asia/Kuala_Lumpur': '+60',
  // Indonesia spans three zones and all three are one dialling country.
  'Asia/Jakarta': '+62',
  'Asia/Makassar': '+62',
  'Asia/Jayapura': '+62',
  'Asia/Manila': '+63',
  'Asia/Bangkok': '+66',
  'Asia/Ho_Chi_Minh': '+84',
  'Asia/Hong_Kong': '+852',
  'Asia/Kolkata': '+91',
  'Europe/London': '+44',
  'Asia/Dubai': '+971',
}

/**
 * Whole regions that map to one code, matched by prefix.
 *
 * America/ -> +1 is a deliberate over-reach: right for the US and Canada, wrong
 * for Latin America. The curated list has no +55 or +52 to be right with, so
 * the real choice for a Sao Paulo visitor is +1 or falling through to Singapore.
 * Both are wrong; +1 is at least the correct hemisphere and the shorter
 * correction. Revisit if those markets ever get a row in DIAL_CODES.
 */
const TIMEZONE_PREFIX_DIAL_CODES: [string, string][] = [
  ['Australia/', '+61'],
  ['America/', '+1'],
]

/** The visitor's dial code from their time zone, or null if we cannot tell. */
function dialCodeFromTimeZone(): string | null {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!zone) return null
    if (TIMEZONE_DIAL_CODES[zone]) return TIMEZONE_DIAL_CODES[zone]
    for (const [prefix, code] of TIMEZONE_PREFIX_DIAL_CODES) {
      if (zone.startsWith(prefix)) return code
    }
  } catch { /* no Intl, or a browser that refuses to resolve the zone */ }
  return null
}

/**
 * Best dial code for this browser, falling back to Singapore.
 *
 * Order is time zone, then language, then +65 — see TIMEZONE_DIAL_CODES for why
 * that way round and not the other.
 *
 * Deliberately NOT used as the initial useState value: this reads navigator and
 * Intl, and a value that differs between server and client is a hydration
 * mismatch. It runs in an effect after mount instead.
 */
function detectDialCode(): string {
  const byZone = dialCodeFromTimeZone()
  if (byZone) return byZone

  try {
    const tags = [navigator.language, ...(navigator.languages || [])].filter(Boolean)
    for (const tag of tags) {
      const region = regionOf(tag)
      if (!region) continue
      const hit = DIAL_CODES.find(d => d.regions.includes(region))
      if (hit) return hit.code
    }
  } catch { /* no navigator, or a locked-down browser */ }
  return DEFAULT_DIAL_CODE
}

/**
 * Combine the selected dial code with what was typed, for storage in E.164.
 *
 * Returns null for an empty field, because phone stays optional — the select
 * has a value at all times and must never on its own count as a phone number.
 *
 * A number the visitor typed in full international form wins over the select:
 * someone who writes +44... after leaving the box on +65 means the +44.
 */
function composePhone(dialCode: string, raw: string): string | null {
  const input = raw.trim()
  if (!input) return null

  if (input.startsWith('+')) {
    const digits = input.slice(1).replace(/\D/g, '')
    return digits ? `+${digits}` : null
  }

  let digits = input.replace(/\D/g, '')
  if (!digits) return null

  // 00 is the international access prefix — 0065 9123 4567 is a full number,
  // not a local one with leading zeros.
  if (digits.startsWith('00')) {
    const rest = digits.slice(2)
    return rest ? `+${rest}` : null
  }

  // Trunk prefix. MY, ID and UK visitors habitually type it and it is not part
  // of the international form.
  digits = digits.replace(/^0+/, '')
  if (!digits) return null

  return `${dialCode}${digits}`
}

/**
 * The dial-code select joined to the number box.
 *
 * Shared by both lead forms on purpose. They write the same leadPhone state and
 * post to the same route, so a country code offered on one and not the other
 * would store some numbers international and some bare, in one column, with no
 * way to tell them apart afterwards.
 */
function PhoneField({
  dialCode,
  onDialCode,
  phone,
  onPhone,
  compact,
}: {
  dialCode: string
  onDialCode: (v: string) => void
  phone: string
  onPhone: (v: string) => void
  compact?: boolean
}) {
  return (
    <div className={compact ? 'qm-phone-row qm-phone-row--sm' : 'qm-phone-row'}>
      <select
        className="qm-dial"
        aria-label="Country dialling code"
        value={dialCode}
        onChange={e => onDialCode(e.target.value)}
      >
        {DIAL_CODES.map(d => (
          <option key={d.code + d.label} value={d.code}>
            {d.flag} {d.code}
          </option>
        ))}
      </select>
      <input
        className={compact ? 'qm-num' : 'lead-input qm-num'}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        aria-label="Phone number"
        // National format only — the country is the box to the left.
        placeholder="9123 4567"
        value={phone}
        onChange={e => onPhone(e.target.value)}
      />
    </div>
  )
}

function readStoredVisitor(botId: string): { name?: string; email?: string; phone?: string } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(visitorKey(botId))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Only a usable identity (has a contact method) is allowed to skip the gate.
    return parsed && (parsed.email || parsed.phone) ? parsed : null
  } catch { return null }
}

function storeVisitor(botId: string, data: { name?: string; email?: string; phone?: string }) {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(visitorKey(botId), JSON.stringify(data)) } catch { /* ignore quota / private mode */ }
}

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
  // Starts on the fallback and is corrected after mount — see detectDialCode.
  const [dialCode, setDialCode] = useState(DEFAULT_DIAL_CODE)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [leadError, setLeadError] = useState('')
  const [triggerMessage, setTriggerMessage] = useState('')
  const [lastCannotAnswer, setLastCannotAnswer] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      const botRes = await fetch(`/api/bots/public/${botId}`)
      if (!botRes.ok) { setBotLoading(false); return }
      const botData = await botRes.json()
      setBot(botData)
      const sessRes = await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ botId }) })
      const sessData = await sessRes.json()
      const newSessionId = sessData.sessionId
      setSessionId(newSessionId)

      if (!botData.lead_capture_enabled) {
        setLeadCaptured(true)
        setMessages([{ role: 'assistant', content: botData.welcome_message }])
      } else {
        // Returning visitor to THIS bot: skip the gate, but still attach the stored
        // identity to this NEW session and upsert the lead. A skipped gate must never
        // mean lost contact data (previously the skip path saved nothing).
        const stored = readStoredVisitor(botId)
        if (stored) {
          setLeadName(stored.name || '')
          setLeadEmail(stored.email || '')
          setLeadPhone(stored.phone || '')
          fetch(`/api/leads/${botId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: stored.name || null, email: stored.email || null, phone: stored.phone || null, sessionId: newSessionId }),
          }).catch(() => {})
          setLeadCaptured(true)
          setMessages([{ role: 'assistant', content: botData.welcome_message }])
        }
      }
      setBotLoading(false)
    }
    init()
  }, [botId])

  // Locale-based default, after mount so server and client render the same thing.
  useEffect(() => { setDialCode(detectDialCode()) }, [])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  async function submitLead(e: React.FormEvent) {
    e.preventDefault()
    if (!leadEmail && !leadPhone) { setLeadError('Please provide an email or phone number'); return }
    setLeadError('')
    setSubmittingLead(true)
    // Stored in E.164 so a number is dialable without knowing where it was typed.
    const phone = composePhone(dialCode, leadPhone)
    const res = await fetch(`/api/leads/${botId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: leadEmail || null, name: leadName, phone, trigger_message: triggerMessage || null, sessionId }) })
    setSubmittingLead(false)
    if (!res.ok) { setLeadError('Something went wrong saving your details. Please try again.'); return }
    // The composed form is what comes back on the next visit, and composePhone
    // passes a leading + through untouched, so this round-trips.
    storeVisitor(botId, { name: leadName, email: leadEmail, phone: phone || '' })
    setLeadCaptured(true)
    setMessages([{ role: 'assistant', content: bot?.welcome_message || 'Hi! How can I help?' }])
  }

  // Short affirmation to a "would you like to reach our team?" prompt. Normalized and
  // kept generous so a typed "Yes" / "sure" / "ok please" never bypasses lead capture.
  function isAffirmation(text: string): boolean {
    const t = text.trim().toLowerCase().replace(/[.!,]+$/g, '')
    const exact = new Set([
      'yes', 'yeah', 'yep', 'yup', 'sure', 'ok', 'okay', 'y', 'please', 'yes please',
      'sure thing', 'ok please', 'okay please', 'please do', 'go ahead', 'sounds good',
      'yes thanks', 'ok thanks', 'definitely', 'absolutely',
    ])
    if (exact.has(t)) return true
    return t.length <= 15 && /^(yes|yeah|yep|yup|sure|ok|okay)\b/.test(t)
  }

  async function sendMessage(e: React.FormEvent | React.MouseEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')

    // If the bot just said it couldn't answer and the visitor affirms, capture the
    // lead inline instead of calling the LLM (which would leak contact info and let
    // the "Yes" bypass capture entirely).
    if (lastCannotAnswer && !leadSubmitted && isAffirmation(userMsg)) {
      setMessages(prev => [...prev,
        { role: 'user', content: userMsg },
        { role: 'assistant', content: 'Great — leave your details below and our team will reach out shortly.' },
      ])
      setLastCannotAnswer(false)
      setShowLeadForm(true)
      return
    }

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

    // Explicit server flag — never phrase-match the (customizable) fallback message.
    if (data.cannot_answer && !leadSubmitted) {
      setTriggerMessage(userMsg)
      setLastCannotAnswer(true)
      if (!showLeadForm) setShowLeadForm(true)
    } else {
      setLastCannotAnswer(false)
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
        /* position:fixed + inset:0 sizes to THIS document's viewport, which
           inside an iframe is the iframe box itself, at whatever height the
           host gave it. That part was always right. What was missing was an
           inner scroller, so anything taller than the frame simply vanished. */
        .chat-page {
          position: fixed;
          inset: 0;
          overflow: hidden;
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
        /* THE SCROLLER FOR THE GATE.
           This used to centre the card with align-items/justify-content and no
           overflow. A centred flex item that outgrows its container overflows
           equally in BOTH directions, and with the page sealed to the viewport
           there was nothing to scroll: in a 500px frame the submit button was
           simply cut off and unreachable.
           overflow-y makes the automatic minimum size of this flex item zero,
           so it shrinks to the space available instead of pushing past it. */
        .lead-card {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          display: flex;
          padding: 24px 16px;
        }
        .lead-inner {
          /* margin:auto, NOT the parent centring it. An auto margin takes the
             spare room when there is some and collapses to zero when there is
             not, so a card taller than the frame starts at the top and every
             pixel of it can be scrolled to. Centring on the parent would clip
             the overflow past the start edge, which is the bug this replaces.
             It also disables the default align-items:stretch, so the card keeps
             its content height. */
          margin: auto;
          flex-shrink: 0;
          width: 100%;
          max-width: 360px;
          background: #0F1117;
          border: 1px solid #1E2028;
          border-radius: 16px;
          padding: 24px 20px;
        }
        /* These four were inline styles. They are classes now because the
           compact rules below live in a media query, and a media query cannot
           override an inline style — the gate would have ignored every one of
           them. Values are unchanged at full height. */
        .lead-emoji { font-size: 28px; text-align: center; margin-bottom: 10px; }
        .lead-title {
          font-size: 17px;
          font-weight: 700;
          text-align: center;
          color: #F0F0F0;
          margin: 0 0 6px;
          font-family: 'Outfit', sans-serif;
        }
        .lead-sub { font-size: 13px; color: #6B7280; text-align: center; margin: 0 0 20px; }
        .lead-hint { font-size: 12px; color: #4B5563; margin: -4px 0 10px; }
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

        /* Dial code + number, joined into one control.
           min-width: 0 on the number input is load-bearing: a flex item's
           default min-width is its intrinsic size, and a text input's intrinsic
           size is wide enough to push the select onto a second line inside the
           ~320px the widget actually has. */
        .qm-phone-row { display: flex; align-items: stretch; margin-bottom: 10px; }
        .qm-phone-row > .qm-num { flex: 1 1 auto; min-width: 0; margin-bottom: 0; border-left: none; border-radius: 0 10px 10px 0; }
        .qm-dial {
          flex: 0 0 auto;
          background-color: #161820;
          border: 1px solid #1E2028;
          border-radius: 10px 0 0 10px;
          color: #F0F0F0;
          font-family: inherit;
          font-size: 16px;
          line-height: 1.2;
          padding: 12px 22px 12px 12px;
          outline: none;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'><path d='M2 4.5l4 4 4-4' fill='none' stroke='%239CA3AF' stroke-width='1.6' stroke-linecap='round'/></svg>");
          background-repeat: no-repeat;
          background-position: right 7px center;
          background-size: 11px 11px;
        }
        .qm-dial:focus { border-color: var(--accent); }
        /* The select's own dropdown list is drawn by the OS and does not inherit
           the dark theme, so the options set their own colours. */
        .qm-dial option { background: #161820; color: #F0F0F0; }

        /* Compact variant, matching the in-conversation lead form. */
        .qm-phone-row--sm { margin-bottom: 12px; }
        .qm-phone-row--sm .qm-dial {
          font-size: 13px;
          padding: 8px 19px 8px 10px;
          border-radius: 6px 0 0 6px;
          background-color: #080A0E;
          border-color: #1A1A2E;
          color: #E2E2F0;
        }
        .qm-phone-row--sm .qm-dial option { background: #080A0E; color: #E2E2F0; }
        .qm-phone-row--sm > .qm-num {
          background: #080A0E;
          border: 1px solid #1A1A2E;
          border-left: none;
          border-radius: 0 6px 6px 0;
          padding: 8px 10px;
          color: #E2E2F0;
          font-size: 13px;
          font-family: inherit;
          outline: none;
        }
        .qm-phone-row--sm > .qm-num::placeholder { color: #4B5563; }
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
        /* ── COMPACT GATE ──────────────────────────────────────────────────
           Under 640px of viewport the gate spends its height on fields rather
           than on decoration. Budget at the 480px target: 61px of header
           (min-height 60 plus its border) leaves 419, and the rules below bring
           the whole card including the submit button to roughly 345 — so it
           fits unscrolled with room left for a three-line custom prompt.

           Height only, no width, and no JS: this is about the frame a host gave
           us, which we do not control and cannot measure without a resize
           observer nobody needs.

           REPLACES the old max-height:560px rule, whose entire content was the
           two paddings repeated on the first line here. Keeping both would have
           left a dead block restating what this one already says.

           The Batch 13 scroller is still the floor: .lead-card keeps its
           overflow-y, so below 480px — or with a very long prompt — the card
           scrolls exactly as before. Compact mode decides how MUCH scrolling
           there is, never whether it is possible. */
        @media (max-height: 639.98px) {
          .lead-card { padding: 12px; }
          .lead-inner { padding: 16px; border-radius: 12px; }
          .lead-emoji { font-size: 24px; line-height: 1; margin-bottom: 6px; }
          .lead-title { font-size: 15px; margin-bottom: 5px; }
          /* "Takes less than 10 seconds" is reassurance. The submit button
             being on screen reassures harder. */
          .lead-sub { display: none; }
          .lead-input { padding: 10px 14px; margin-bottom: 8px; }
          .lead-hint { margin: -3px 0 8px; }
          .lead-btn { padding: 11px; }
          /* Scoped to the gate. .qm-phone-row is also worn by the
             in-conversation form's --sm variant, which is not on this screen
             and keeps its own smaller metrics. The select's vertical padding
             has to track .lead-input or the joined control stops lining up. */
          .lead-inner .qm-phone-row { margin-bottom: 8px; }
          .lead-inner .qm-dial { padding: 10px 22px 10px 12px; }
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
              <div className="lead-emoji">👋</div>
              <h2 className="lead-title">
                {bot.lead_capture_prompt || 'Enter your details to start chatting'}
              </h2>
              <p className="lead-sub">Takes less than 10 seconds</p>
              <input className="lead-input" placeholder="Your name (optional)" value={leadName} onChange={e => setLeadName(e.target.value)} />
              <input className="lead-input" type="email" inputMode="email" placeholder="Your email address" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} />
              <PhoneField dialCode={dialCode} onDialCode={setDialCode} phone={leadPhone} onPhone={setLeadPhone} />
              <p className="lead-hint">Phone (optional if email provided)</p>
              {leadError && <p style={{ fontSize: '12px', color: '#f87171', marginBottom: '8px' }}>{leadError}</p>}
              <button className="lead-btn" onClick={submitLead} disabled={submittingLead || (!leadEmail && !leadPhone)} style={{ background: accent, color: '#080A0E' }}>
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
                  <PhoneField compact dialCode={dialCode} onDialCode={setDialCode} phone={leadPhone} onPhone={setLeadPhone} />
                  <p style={{ color: '#4B5563', fontSize: 11, margin: '0 0 10px' }}>* Email or phone required</p>
                  <button
                    onClick={async () => {
                      if (!leadName.trim()) { setLeadError('Please enter your name'); return }
                      if (!leadEmail.trim() && !leadPhone.trim()) { setLeadError('Please enter your email or phone number'); return }
                      setLeadError('')
                      // Same upsert route as the pre-chat gate — keyed on session_id,
                      // so this attaches the trigger_message (and phone) to the lead.
                      const res = await fetch(`/api/leads/${botId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: leadName,
                          email: leadEmail || null,
                          // Same E.164 composition as the gate, from the same
                          // selected dial code.
                          phone: composePhone(dialCode, leadPhone),
                          trigger_message: triggerMessage || null,
                          sessionId,
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
            {(bot.contact_whatsapp || bot.contact_phone || bot.contact_email || bot.contact_website || bot.contact_instagram || bot.contact_facebook) && (
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
                {bot.contact_instagram && (
                  <a href={bot.contact_instagram} target="_blank" rel="noreferrer" className="contact-btn" style={{ background: '#1a0a1a', color: '#f472b6', border: '1px solid #831843' }}>
                    📸 Instagram
                  </a>
                )}
                {bot.contact_facebook && (
                  <a href={bot.contact_facebook} target="_blank" rel="noreferrer" className="contact-btn" style={{ background: '#0a0f28', color: '#818cf8', border: '1px solid #312e81' }}>
                    👍 Facebook
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
