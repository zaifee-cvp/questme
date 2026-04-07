'use client'
import { useState } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#080A0E', color: '#F0F0F0' }}>
      <style>{`
        .nav-hamburger { display: none; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; padding: 4px; color: #F0F0F0; }
        @media (max-width: 639px) {
          .nav-links { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>

      <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <nav style={{ borderBottom: '1px solid #1E2028', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1100px', margin: '0 auto', background: '#080A0EE8', backdropFilter: 'blur(12px)', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: '#AAFF00', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '16px', color: '#080A0E', fontFamily: 'Outfit, sans-serif' }}>Q</div>
            <span style={{ fontWeight: 700, fontSize: '18px', fontFamily: 'Outfit, sans-serif' }}>Questme<span style={{ color: '#AAFF00' }}>.ai</span></span>
          </div>
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <a href="#features" style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none' }}>Features</a>
            <a href="/blog" style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none' }}>Blog</a>
            <a href="#pricing" style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none' }}>Pricing</a>
            <Link href="/sign-in" style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none' }}>Sign in</Link>
            <Link href="/sign-up" className="btn-accent" style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '8px' }}>Start free</Link>
          </div>
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="5" width="18" height="2" rx="1" fill="currentColor" />
              <rect x="2" y="10" width="18" height="2" rx="1" fill="currentColor" />
              <rect x="2" y="15" width="18" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>
        </nav>

        {menuOpen && (
          <div style={{ background: '#080A0EE8', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1E2028', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <a href="#features" onClick={() => setMenuOpen(false)} style={{ fontSize: '15px', color: '#9CA3AF', textDecoration: 'none' }}>Features</a>
            <a href="/blog" onClick={() => setMenuOpen(false)} style={{ fontSize: '15px', color: '#9CA3AF', textDecoration: 'none' }}>Blog</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} style={{ fontSize: '15px', color: '#9CA3AF', textDecoration: 'none' }}>Pricing</a>
            <Link href="/sign-in" onClick={() => setMenuOpen(false)} style={{ fontSize: '15px', color: '#9CA3AF', textDecoration: 'none' }}>Sign in</Link>
            <Link href="/sign-up" className="btn-accent" onClick={() => setMenuOpen(false)} style={{ padding: '10px 20px', fontSize: '15px', borderRadius: '8px', textAlign: 'center' }}>Start free</Link>
          </div>
        )}
      </div>

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
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Questme Demo Bot</div>
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

      <section style={{ borderTop: '1px solid #1E2028', borderBottom: '1px solid #1E2028', background: '#0F1117', padding: '28px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '24px', textAlign: 'center' }}>
          {[
            { value: '500+', label: 'Businesses using Questme' },
            { value: '2M+', label: 'Questions answered' },
            { value: '<2s', label: 'Average response time' },
            { value: '98%', label: 'Answer accuracy rate' },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#AAFF00', fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '64px 24px', background: '#0F1117' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '12px' }}>See it in action</p>
            <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif', color: '#F0F0F0' }}>Watch how Questme works</h2>
            <p style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '8px' }}>From uploading your docs to answering customer questions — under 2 minutes</p>
          </div>
          <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1E2028', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <iframe
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              src="https://www.youtube.com/embed/5wvbgdnFAqk?rel=0&modestbranding=1"
              title="Questme.ai Demo — AI Product Knowledge Bot"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
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

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '12px' }}>Testimonials</div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>What our customers say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {[
            {
              quote: 'Our support ticket volume dropped 42% in the first 6 weeks. Questme handles all the basic product questions automatically.',
              name: 'Sarah Lim',
              role: 'Head of Customer Success, TechFlow',
              location: 'Singapore',
            },
            {
              quote: 'We embedded Questme on our product pages and saw session times increase immediately. Customers get answers without leaving the page.',
              name: 'Ahmed Malik',
              role: 'Product Manager, MENA Growth Co.',
              location: 'UAE',
            },
            {
              quote: 'Setup took 15 minutes. We uploaded our product PDF and it was live. Genuinely one of the easiest tools I\'ve deployed.',
              name: 'Tom Bradley',
              role: 'E-commerce Manager',
              location: 'Melbourne, Australia',
            },
          ].map((t) => (
            <div key={t.name} className="card" style={{ borderColor: '#1E2028', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: '#AAFF00', fontSize: '16px' }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: '15px', color: '#D1D5DB', lineHeight: 1.7, flex: 1 }}>&ldquo;{t.quote}&rdquo;</p>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#F0F0F0', fontFamily: 'Outfit, sans-serif' }}>{t.name}</div>
                <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>{t.role}</div>
                <div style={{ fontSize: '12px', color: '#4B5563', marginTop: '1px' }}>{t.location}</div>
              </div>
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
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280', marginTop: '24px' }}>All prices in USD. 14-day free trial. No credit card required.</p>
      </section>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '60px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>
            Ready to transform your<br /><span style={{ color: '#AAFF00' }}>customer support?</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '32px' }}>Join businesses already using Questme.ai to answer customer questions 24/7.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 40px' }}>
              Start for free — no credit card
            </Link>
            <Link href="/blog" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 32px' }}>
              Read our blog →
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: 'Questme.ai Demo — AI Product Knowledge Bot',
          description: 'See how Questme turns your product docs, FAQs, and URLs into an AI bot that answers customer questions instantly.',
          thumbnailUrl: 'https://img.youtube.com/vi/5wvbgdnFAqk/maxresdefault.jpg',
          uploadDate: '2026-03-31',
          contentUrl: 'https://www.youtube.com/watch?v=5wvbgdnFAqk',
          embedUrl: 'https://www.youtube.com/embed/5wvbgdnFAqk',
          publisher: {
            '@type': 'Organization',
            name: 'Questme.ai',
            url: 'https://www.questme.ai'
          }
        })}}
      />

      <section id="faq" style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '12px' }}>FAQ</div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>Frequently asked questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '760px', margin: '0 auto' }}>
          {[
            {
              q: 'What is Questme.ai?',
              a: 'Questme.ai is an AI chatbot platform that lets businesses train a bot on their own product knowledge — documents, URLs, FAQs — and deploy it on their website or WhatsApp to answer customer questions 24/7.',
            },
            {
              q: 'How does the AI chatbot learn about my business?',
              a: 'You upload your product docs, paste URLs, or type FAQs directly into the dashboard. Questme indexes the content automatically. The bot only answers from your uploaded knowledge — it never makes things up.',
            },
            {
              q: 'What happens if the chatbot can\'t answer a question?',
              a: 'If the bot has no matching knowledge, it tells the visitor honestly and can trigger a human handoff — notifying your team by email so no lead is lost.',
            },
            {
              q: 'Can I embed the chatbot on any website?',
              a: 'Yes. Questme generates a single script tag that works on any website — Shopify, Webflow, WordPress, or custom HTML. No developer needed.',
            },
            {
              q: 'Is there a free plan?',
              a: 'Yes. Questme offers a 14-day free trial on all plans with no credit card required. You can test the full product before committing.',
            },
          ].map((item) => (
            <div key={item.q} className="card">
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '10px', fontFamily: 'Outfit, sans-serif', color: '#F0F0F0' }}>{item.q}</div>
              <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.7 }}>{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 56px' }}>
        <div style={{ borderTop: '1px solid #1E2028', paddingTop: '40px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '20px' }}>Resources &amp; Guides</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <Link href="/blog" style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'none', border: '1px solid #1E2028', borderRadius: '8px', padding: '7px 14px', background: '#0F1117' }}>Blog</Link>
            <Link href="/ai-customer-support-chatbot" style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'none', border: '1px solid #1E2028', borderRadius: '8px', padding: '7px 14px', background: '#0F1117' }}>AI Customer Support Chatbot</Link>
            <Link href="/ai-product-knowledge-chatbot" style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'none', border: '1px solid #1E2028', borderRadius: '8px', padding: '7px 14px', background: '#0F1117' }}>AI Product Knowledge Chatbot</Link>
            <Link href="/website-ai-chatbot-for-lead-generation" style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'none', border: '1px solid #1E2028', borderRadius: '8px', padding: '7px 14px', background: '#0F1117' }}>Website Chatbot for Lead Generation</Link>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #1E2028', padding: '32px 24px', maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', background: '#AAFF00', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '12px', color: '#080A0E', fontFamily: 'Outfit, sans-serif' }}>Q</div>
          <span style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'Outfit, sans-serif' }}>Questme<span style={{ color: '#AAFF00' }}>.ai</span></span>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="/blog" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Blog</a>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>2026 Questme.ai — Built for product-led businesses · All prices in USD</span>
        </div>
      </footer>
    </div>
  )
}
