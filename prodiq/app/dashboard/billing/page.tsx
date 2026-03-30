'use client'
import { useState, useEffect } from 'react'
import { Check, Zap } from 'lucide-react'

const PLANS = [
  { id: 'starter', name: 'Starter', price: '$68', features: ['1 bot', '500 chats/month', '50 pages indexed', 'URL, text & FAQ sources', 'Embeddable widget'] },
  { id: 'pro', name: 'Pro', price: '$128', features: ['3 bots', '2,000 chats/month', '200 pages indexed', 'PDF upload', 'Lead capture', 'Human handoff'], popular: true },
  { id: 'scale', name: 'Scale', price: '$248', features: ['Unlimited bots', '10,000 chats/month', 'Unlimited pages', 'All Pro features', 'Weekly digest email'] },
]

export default function BillingPage() {
  const [sub, setSub] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState('')

  useEffect(() => {
    fetch('/api/subscriptions/me').then(r => r.json()).then(d => { setSub(d); setLoading(false) })
  }, [])

  async function openCheckout(planId: string) {
    setCheckoutLoading(planId)
    const priceId = planId === 'starter' ? process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID
      : planId === 'pro' ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
      : process.env.NEXT_PUBLIC_STRIPE_SCALE_PRICE_ID
    const res = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ priceId }) })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    setCheckoutLoading('')
  }

  async function openPortal() {
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  if (loading) return <div style={{ color: '#6B7280', textAlign: 'center', padding: '60px' }}>Loading billing...</div>

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>Billing</h1>
        <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>
          Current plan: <strong style={{ color: '#AAFF00', textTransform: 'capitalize' }}>{sub?.plan || 'Free'}</strong>
          {sub?.current_period_end && <> · Renews {new Date(sub.current_period_end).toLocaleDateString()}</>}
        </p>
      </div>
      {sub?.plan !== 'free' && (
        <div className="card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderColor: '#AAFF0040' }}>
          <div>
            <div style={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>Manage your subscription</div>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>Change plan, update payment, view invoices</div>
          </div>
          <button className="btn-ghost" onClick={openPortal}><Zap size={14} />Manage</button>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {PLANS.map(plan => {
          const isCurrent = sub?.plan === plan.id
          return (
            <div key={plan.id} className="card" style={{ border: (plan as any).popular ? '2px solid #AAFF00' : isCurrent ? '1px solid #AAFF0060' : undefined, position: 'relative', paddingTop: (plan as any).popular ? '32px' : '20px' }}>
              {(plan as any).popular && <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#AAFF00', color: '#080A0E', fontSize: '10px', fontWeight: 900, padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap', fontFamily: 'Outfit, sans-serif' }}>MOST POPULAR</div>}
              {isCurrent && <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#AAFF0020', color: '#AAFF00', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '10px' }}>Current</div>}
              <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '6px' }}>{plan.name}</div>
              <div style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-2px', marginBottom: '20px', fontFamily: 'Outfit, sans-serif' }}>
                {plan.price}<span style={{ fontSize: '14px', fontWeight: 400, color: '#9CA3AF' }}>/mo</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#D1D5DB' }}>
                    <Check size={14} style={{ color: '#AAFF00', flexShrink: 0 }} />{f}
                  </div>
                ))}
              </div>
              <button className={isCurrent ? 'btn-ghost' : 'btn-accent'} disabled={isCurrent || !!checkoutLoading} onClick={() => !isCurrent && openCheckout(plan.id)} style={{ width: '100%', justifyContent: 'center', opacity: isCurrent ? 0.5 : 1 }}>
                {isCurrent ? 'Current plan' : checkoutLoading === plan.id ? 'Loading...' : 'Upgrade'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
