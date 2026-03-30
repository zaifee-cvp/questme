'use client'
import { useState, useEffect } from 'react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$68',
    description: 'Perfect for solo businesses and small shops',
    features: [
      '1 bot',
      '500 chats/month',
      '50 pages indexed',
      'URL, text & FAQ sources',
      'Embeddable widget',
      'Shareable chat link',
      'Contact details',
      'Lead capture',
    ],
    notIncluded: [
      'PDF upload',
      'Human handoff',
      'Analytics & knowledge gaps',
      'White label',
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$128',
    description: 'For growing businesses that want more power',
    features: [
      '5 bots',
      '3,000 chats/month',
      '300 pages indexed',
      'Everything in Starter',
      'PDF file upload',
      'Human handoff email',
      'Analytics & knowledge gaps',
      'Weekly digest email',
      'Priority support',
    ],
    notIncluded: [
      'White label (remove Questme.ai branding)',
      'API access',
    ],
    popular: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: '$248',
    description: 'For agencies and businesses that want full control',
    features: [
      'Unlimited bots',
      '10,000 chats/month',
      'Unlimited pages indexed',
      'Everything in Pro',
      'White label — remove Questme.ai branding',
      'Custom bot accent colors',
      'API access',
      'Dedicated support',
    ],
    notIncluded: []
  },
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
            <div style={{ fontSize: '13px', color: '#6B7280' }}>Change plan, update payment method, view invoices</div>
          </div>
          <button className="btn-ghost" onClick={openPortal} style={{ flexShrink: 0 }}>Manage</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {PLANS.map(plan => {
          const isCurrent = sub?.plan === plan.id
          return (
            <div key={plan.id} className="card" style={{ border: (plan as any).popular ? '2px solid #AAFF00' : isCurrent ? '1px solid #AAFF0060' : undefined, position: 'relative', paddingTop: (plan as any).popular ? '32px' : '20px', display: 'flex', flexDirection: 'column' }}>
              {(plan as any).popular && (
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#AAFF00', color: '#080A0E', fontSize: '10px', fontWeight: 900, padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap', fontFamily: 'Outfit, sans-serif' }}>MOST POPULAR</div>
              )}
              {isCurrent && (
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#AAFF0020', color: '#AAFF00', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '10px' }}>Current</div>
              )}
              <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '4px' }}>{plan.name}</div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '12px' }}>{(plan as any).description}</div>
              <div style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-2px', marginBottom: '20px', fontFamily: 'Outfit, sans-serif' }}>
                {plan.price}<span style={{ fontSize: '14px', fontWeight: 400, color: '#9CA3AF' }}>/mo</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', flex: 1 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#D1D5DB' }}>
                    <span style={{ color: '#AAFF00', flexShrink: 0, marginTop: '1px' }}>✓</span>{f}
                  </div>
                ))}
                {(plan as any).notIncluded?.map((f: string) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#4B5563' }}>
                    <span style={{ flexShrink: 0, marginTop: '1px' }}>✗</span>{f}
                  </div>
                ))}
              </div>
              <button
                className={isCurrent ? 'btn-ghost' : 'btn-accent'}
                disabled={isCurrent || !!checkoutLoading}
                onClick={() => !isCurrent && openCheckout(plan.id)}
                style={{ width: '100%', justifyContent: 'center', opacity: isCurrent ? 0.5 : 1 }}
              >
                {isCurrent ? 'Current plan' : checkoutLoading === plan.id ? 'Loading...' : plan.id === 'scale' ? 'Get Scale →' : 'Upgrade'}
              </button>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '24px', padding: '16px 20px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}>All plans include</div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>14-day free trial · No credit card required to start · Cancel anytime · SSL secured</div>
        </div>
        <div style={{ fontSize: '12px', color: '#6B7280' }}>Need a custom plan? <a href="mailto:support@questme.ai" style={{ color: '#AAFF00', textDecoration: 'none' }}>Contact us</a></div>
      </div>
    </div>
  )
}
