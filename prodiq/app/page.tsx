import Link from 'next/link'
import { Check } from 'lucide-react'

const FEATURES = [
  { icon: '⚡', title: 'URL auto-crawl', desc: 'Paste any URL — we crawl, parse, and index the content automatically in seconds.' },
  { icon: '🎯', title: 'Zero hallucination', desc: 'Bot answers ONLY from your uploaded content. If it does not know, it says so honestly.' },
  { icon: '📊', title: 'Knowledge gap alerts', desc: 'See which customer questions the bot could not answer so you can fill the gaps.' },
  { icon: '💌', title: 'Lead capture', desc: 'Gate the chat with an email form. Every chat session becomes a qualified lead.' },
  { icon: '🔌', title: 'One-line embed', desc: 'One script tag. Works on any website, Shopify, Webflow, WordPress — anywhere.' },
  { icon: '🤝', title: 'Human handoff', desc: 'Trigger words like "speak to someone" escalate the chat to your team via email.' },
]

const PRICING = [
  {
    name: 'Starter', price: '$68', period: '/mo',
    features: ['1 bot', '500 chats/month', '50 pages indexed', 'URL, text, FAQ sources', 'Embeddable widget', 'Shareable link'],
    popular: false,
  },
  {
    name: 'Pro', price: '$128', period: '/mo',
    features: ['3 bots', '2,000 chats/month', '200 pages indexed', 'PDF file upload', 'Lead capture', 'Knowledge gap analytics', 'Human handoff email'],
    popular: true,
  },
  {
    name: 'Scale', price: '$248', period: '/mo',
    features: ['Unlimited bots', '10,000 chats/month', 'Unlimited pages', 'All Pro features', 'Weekly digest email', 'Priority support'],
    popular: false,
  },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#080A0E', color: '#F0F0F0' }}>
      <nav style={{ borderBottom: '1px solid #1E2028', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1100px', margin: '0 auto', position: 'sticky', top: 0, background: '#080A0EE8', backdropFilter: 'blur(12px)', zIndex: 50, width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#AAFF00', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '16px', color: '#080A0E', fontFamily: 'Outfit, sans-serif' }}>Q</div>
          <span style={{ fontWeight: 700, fontSize: '18px', fontFamily: 'Outfit, sans-serif' }}>Questme<span style={{ color: '#AAFF00' }}>.ai</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a href="#features" style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none' }}>Features</a>
          <a href="#pricing" style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none' }}>Pricing</a>
          <Link href="/sign-in" style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/sign-up" className="btn-accent" style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '8px' }}>Start free</Link>
        </div>
      </nav>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', color: '#9CA3AF', marginBottom: '32px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#AAFF00', display: 'inline-block' }}></span>
          AI Product Knowledge Platform
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-2px', fontFamily: 'Outfit, sans-serif' }}>
          Your product,<br />
          <span style={{ color: '#AAFF00' }}>perfectly explained</span><br />
          24 hours a day
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          Upload your product knowledge. Get an embeddable AI that answers every customer question — instantly, accurately, only from your content.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 32px' }}>Start for free →</Link>
          <a href="#features" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 32px' }}>See how it works</a>
        </div>
        <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '16px' }}>No credit card required · Free plan available</p>
      </section>

      <section style={{ maxWidth: '480px', margin: '0 auto 80px', padding: '0 24px' }}>
        <div className="card" style={{ borderColor: '#2a2d38' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '14px', borderBottom: '1px solid #1E2028', marginBottom: '16px' }}>
            <div style={{ width: '34px', height: '34px', background: '#AAFF00', borderRadius: '50%', fontWeight: 900, fontSize: '14px', color: '#080A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>A</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Acme Products Bot</div>
              <div style={{ fontSize: '11px', color: '#AAFF00' }}>● Online now</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
            <div style={{ background: '#161820', border: '1px solid #1E2028', borderRadius: '12px 12px 12px 2px', padding: '10px 14px', fontSize: '13px', color: '#9CA3AF', maxWidth: '85%', lineHeight: 1.5 }}>
              Hi! I can answer any questions about our products. What would you like to know?
            </div>
            <div style={{ background: '#AAFF00', borderRadius: '12px 12px 2px 12px', padding: '10px 14px', fontSize: '13px', color: '#080A0E', fontWeight: 600, alignSelf: 'flex-end', maxWidth: '72%' }}>
              What is your return policy?
            </div>
            <div style={{ background: '#161820', border: '1px solid #1E2028', borderRadius: '12px 12px 12px 2px', padding: '10px 14px', fontSize: '13px', color: '#9CA3AF', maxWidth: '90%', lineHeight: 1.5 }}>
              We offer a 30-day money-back guarantee on all products. Contact us with your order number and we will process your refund within 3 business days.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#161820', border: '1px solid #2a2d38', borderRadius: '10px', padding: '10px 14px' }}>
            <span style={{ fontSize: '13px', color: '#4B5563', flex: 1 }}>Ask me anything...</span>
            <div style={{ width: '28px', height: '28px', background: '#AAFF00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#080A0E', fontWeight: 900 }}>↑</div>
          </div>
        </div>
      </section>

      <section id="features" style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '12px' }}>Features</div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>Everything you need</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="card">
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{f.title}</div>
              <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how" style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '12px' }}>How it works</div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>Live in 3 steps</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[
            { n: '01', title: 'Upload your knowledge', desc: 'Paste URLs, upload PDFs, type FAQs, or paste raw text. Any format works.' },
            { n: '02', title: 'AI indexes instantly', desc: 'Smart chunking and vector embeddings process your content in seconds.' },
            { n: '03', title: 'Embed anywhere', desc: 'One script tag. Your bot is live on any website immediately.' },
          ].map(s => (
            <div key={s.n} className="card">
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#AAFF00', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>{s.n}</div>
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{s.title}</div>
              <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '12px' }}>Pricing</div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>Simple, transparent pricing</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {PRICING.map((plan) => (
            <div key={plan.name} className="card" style={{ border: plan.popular ? '2px solid #AAFF00' : undefined, position: 'relative', paddingTop: plan.popular ? '32px' : '20px' }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#AAFF00', color: '#080A0E', fontSize: '10px', fontWeight: 900, padding: '4px 16px', borderRadius: '20px', whiteSpace: 'nowrap', fontFamily: 'Outfit, sans-serif' }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>{plan.name}</div>
              <div style={{ fontSize: '42px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-2px', fontFamily: 'Outfit, sans-serif' }}>
                {plan.price}<span style={{ fontSize: '16px', fontWeight: 400, color: '#9CA3AF' }}>{plan.period}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#D1D5DB' }}>
                    <Check size={15} style={{ color: '#AAFF00', flexShrink: 0 }} />{f}
                  </div>
                ))}
              </div>
              <Link href="/sign-up" className={plan.popular ? 'btn-accent' : 'btn-ghost'} style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                Get started
              </Link>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280', marginTop: '24px' }}>All plans include a 14-day free trial. No credit card required to start.</p>
      </section>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '60px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>
            Ready to transform your<br /><span style={{ color: '#AAFF00' }}>customer support?</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '32px' }}>Join businesses already using Questme.ai to answer customer questions 24/7.</p>
          <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 40px' }}>
            Start for free — no credit card
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #1E2028', padding: '32px 24px', maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', background: '#AAFF00', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '12px', color: '#080A0E', fontFamily: 'Outfit, sans-serif' }}>Q</div>
          <span style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'Outfit, sans-serif' }}>Questme<span style={{ color: '#AAFF00' }}>.ai</span></span>
        </div>
        <div style={{ fontSize: '13px', color: '#6B7280' }}>2025 Questme.ai — Built for product-led businesses</div>
      </footer>
    </div>
  )
}
