'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'

const FEATURES = [
  { icon: '⚡', title: 'Fast setup from your website', desc: 'Paste your URLs, FAQs, docs, or text. Questme builds your knowledge bot in minutes.' },
  { icon: '🎯', title: 'Answers from your content', desc: 'Responses are grounded in your uploaded business knowledge, not generic internet guesses.' },
  { icon: '📊', title: 'See unanswered questions', desc: 'Spot knowledge gaps quickly so your team can improve answers that drive conversions.' },
  { icon: '💌', title: 'Lead capture in conversation', desc: 'Collect visitor details inside chat while they are engaged and ready to take action.' },
  { icon: '🔌', title: 'Embed on any website', desc: 'Add one script tag to launch on Shopify, Webflow, WordPress, or a custom site.' },
  { icon: '🤝', title: 'Smooth human handoff', desc: 'Route high-intent or complex conversations to your team so leads do not get lost.' },
]

const PAIN_POINTS = [
  {
    title: 'Visitors leave with unanswered questions',
    desc: 'Slow replies create drop-off during high-intent moments.',
  },
  {
    title: 'Support teams repeat the same answers',
    desc: 'Manual responses consume time that should go to higher-value work.',
  },
  {
    title: 'Forms miss buying intent',
    desc: 'Static forms collect less context than real conversations.',
  },
]

const DIFFERENTIATORS = [
  {
    title: 'Built for business websites',
    desc: 'Questme is designed to answer product and service questions where decisions happen: on your site.',
  },
  {
    title: 'Grounded in your knowledge base',
    desc: 'Train on your own docs, pages, and FAQs so answers stay aligned with your business.',
  },
  {
    title: 'Supports both service and sales journeys',
    desc: 'Resolve common questions while capturing intent and routing qualified conversations to your team.',
  },
]

const USE_CASES = [
  {
    title: 'Ecommerce stores',
    desc: 'Answer product, shipping, and policy questions instantly so buyers do not drop before checkout.',
  },
  {
    title: 'SaaS and product companies',
    desc: 'Resolve feature, plan, and onboarding questions quickly to keep sign-up intent moving.',
  },
  {
    title: 'Service teams with repeat enquiries',
    desc: 'Cut repetitive support workload so your team can focus on high-value, human conversations.',
  },
]

const TRUST_LAYER = [
  {
    title: 'Answers from your content only',
    desc: 'Questme responds from your uploaded docs, URLs, FAQs, and product information.',
  },
  {
    title: 'Transparent when unsure',
    desc: 'If the answer is not in your knowledge base, the bot can say so instead of guessing.',
  },
  {
    title: 'Human handoff when needed',
    desc: 'Escalate high-intent or sensitive conversations to your team without losing context.',
  },
  {
    title: 'Launch quickly, no code-heavy setup',
    desc: 'Get live with a simple embed and start answering visitors in minutes.',
  },
]

const OUTCOMES = [
  {
    title: 'Convert more visitors',
    desc: 'Answer buying questions in real time before prospects leave your site.',
  },
  {
    title: 'Reduce repetitive support load',
    desc: 'Automate common questions so your team can focus on complex, revenue-impact work.',
  },
  {
    title: 'Capture more qualified leads',
    desc: 'Collect lead details inside active conversations, not after intent has dropped.',
  },
  {
    title: 'Stay responsive after hours',
    desc: 'Keep customer conversations moving 24/7 across time zones and business hours.',
  },
]

const PRICING = [
  {
    name: 'Starter', price: '$68', period: '/mo',
    bestFor: 'Best for solo operators and early-stage teams',
    features: ['1 bot', '500 chats/month', '50 pages indexed', 'Embeddable widget', 'URL, text, FAQ sources', 'Shareable link'],
    cta: 'Start free trial',
    popular: false,
  },
  {
    name: 'Pro', price: '$128', period: '/mo',
    bestFor: 'Best for growing teams handling lead and support volume',
    features: ['3 bots', '2,000 chats/month', '200 pages indexed', 'Lead capture', 'Knowledge gap analytics', 'Human handoff email', 'PDF file upload'],
    cta: 'Start free trial',
    popular: true,
  },
  {
    name: 'Scale', price: '$248', period: '/mo',
    bestFor: 'Best for multi-brand or high-traffic businesses',
    features: ['Unlimited bots', '10,000 chats/month', 'Unlimited pages', 'All Pro features', 'Weekly digest email', 'Priority support'],
    cta: 'Start free trial',
    popular: false,
  },
]

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showMobileCta, setShowMobileCta] = useState(false)
  const heroRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const heroNode = heroRef.current
    if (!heroNode) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMobileCta(!entry.isIntersecting)
      },
      { threshold: 0.15 }
    )

    observer.observe(heroNode)
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#080A0E', color: '#F0F0F0' }}>
      <style>{`
        .nav-hamburger { display: none; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; padding: 4px; color: #F0F0F0; }
        .nav-mobile-signin { display: none; }
        @media (max-width: 639px) {
          .nav-links { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-mobile-signin { display: inline-flex !important; align-items: center; font-size: 13px; color: #9CA3AF; text-decoration: none; padding: 6px 10px; border: 1px solid #2D3148; border-radius: 8px; }
          .hero-h1 { letter-spacing: -1px !important; }
          .hero-para { font-size: 16px !important; }
          .section-h2 { font-size: 26px !important; letter-spacing: -0.5px !important; }
          .cta-inner { padding: 40px 20px !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .hero-actions { width: 100%; }
          .hero-actions > * { width: 100%; justify-content: center; }
          .hero-stats { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .works-with { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          .works-with-item { justify-content: center; }
        }
        .mobile-sticky-cta { display: none; }
        @media (max-width: 767px) {
          .mobile-sticky-cta { display: flex; }
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
            <Link href="/sign-up" className="btn-accent" style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '8px' }}>Start free trial</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/sign-in" className="nav-mobile-signin">Sign in</Link>
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
          </div>
        </nav>

        {menuOpen && (
          <div style={{ background: '#080A0EE8', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1E2028', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <a href="#features" onClick={() => setMenuOpen(false)} style={{ fontSize: '15px', color: '#9CA3AF', textDecoration: 'none' }}>Features</a>
            <a href="/blog" onClick={() => setMenuOpen(false)} style={{ fontSize: '15px', color: '#9CA3AF', textDecoration: 'none' }}>Blog</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} style={{ fontSize: '15px', color: '#9CA3AF', textDecoration: 'none' }}>Pricing</a>
            <Link href="/sign-in" onClick={() => setMenuOpen(false)} style={{ fontSize: '15px', color: '#9CA3AF', textDecoration: 'none' }}>Sign in</Link>
            <Link href="/sign-up" className="btn-accent" onClick={() => setMenuOpen(false)} style={{ padding: '10px 20px', fontSize: '15px', borderRadius: '8px', textAlign: 'center' }}>Start free trial</Link>
          </div>
        )}
      </div>

      <section ref={heroRef} style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', color: '#9CA3AF', marginBottom: '32px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#AAFF00', display: 'inline-block' }}></span>
          AI Website Answers for Businesses
        </div>
        <h1 className="hero-h1" style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-2px', fontFamily: 'Outfit, sans-serif' }}>
          Stop losing buyers to<br />
          <span style={{ color: '#AAFF00' }}>unanswered product questions</span><br />
          24/7
        </h1>
        <p className="hero-para" style={{ fontSize: '18px', color: '#9CA3AF', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          Questme helps ecommerce, SaaS, and service websites answer visitor questions instantly from their own knowledge base, reduce support workload, and capture more qualified lead intent.
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['For ecommerce stores', 'For SaaS and product teams', 'For service businesses', 'No-code launch'].map((pill) => (
            <span key={pill} style={{ fontSize: '12px', color: '#D1D5DB', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '999px', padding: '6px 12px' }}>
              {pill}
            </span>
          ))}
        </div>
        <div className="hero-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 32px' }}>Add AI answers to my website</Link>
          <a href="#how" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 32px' }}>See how Questme works</a>
        </div>
        <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '16px' }}>14-day free trial · No credit card required</p>
        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>Every delayed answer risks a lost lead. Questme responds in real time.</p>

        <div className="hero-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginTop: '28px' }}>
          {[
            'Trusted by product-led teams',
            'Zero hallucination guarantee',
            '<2s response time',
            'Answers only from your content',
          ].map((stat) => (
            <div key={stat} style={{ border: '1px solid #1E2028', background: '#0F1117', color: '#D1D5DB', borderRadius: '12px', padding: '10px 12px', fontSize: '12px', fontWeight: 600 }}>
              {stat}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.6px', color: '#6B7280', marginBottom: '10px' }}>Embed on any platform</p>
          <div className="works-with" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '8px' }}>
            {['Shopify', 'WordPress', 'Webflow', 'Squarespace', 'Wix', 'Custom HTML'].map((platform) => (
              <div key={platform} className="works-with-item" style={{ border: '1px solid #1E2028', borderRadius: '999px', padding: '6px 10px', background: '#0F1117', fontSize: '12px', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {platform}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 70px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '10px' }}>Why this matters</div>
          <h2 className="section-h2" style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>
            Why visitors leave before they buy
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {PAIN_POINTS.map((item) => (
            <div key={item.title} className="card" style={{ borderColor: '#2a2d38' }}>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#F0F0F0', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{item.title}</div>
              <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          ))}
        </div>
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

      <section style={{ borderTop: '1px solid #1E2028', borderBottom: '1px solid #1E2028', background: '#0F1117', padding: '34px 24px' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '10px' }}>Trust layer</div>
            <h2 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>Built for reliable business answers</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {TRUST_LAYER.map((item) => (
              <div key={item.title} className="card" style={{ borderColor: '#2a2d38', padding: '18px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
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
              src="https://www.youtube.com/embed/p5UDyeLil6I?rel=0&modestbranding=1"
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
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>Built to answer, qualify, and convert</h2>
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
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>Go live in 3 simple steps</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[
            { n: '01', title: 'Add your business knowledge', desc: 'Import URLs, PDFs, FAQs, and text so Questme understands your products and services.' },
            { n: '02', title: 'Review and launch your bot', desc: 'Questme prepares your knowledge base so responses stay aligned with your content.' },
            { n: '03', title: 'Embed and start answering', desc: 'Install one script tag and let visitors get instant answers across your website.' },
          ].map(s => (
            <div key={s.n} className="card">
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#AAFF00', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>{s.n}</div>
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{s.title}</div>
              <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '34px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '12px' }}>Who it is for</div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>
            Built for teams that cannot afford missed website conversations
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {USE_CASES.map((item) => (
            <div key={item.title} className="card" style={{ borderColor: '#1E2028' }}>
              <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{item.title}</div>
              <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '12px' }}>Why Questme</div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>More than a generic chatbot</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {DIFFERENTIATORS.map((item) => (
            <div key={item.title} className="card" style={{ borderColor: '#1E2028', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#AAFF00' }}>Differentiator</div>
              <div style={{ fontWeight: 700, fontSize: '20px', color: '#F0F0F0', fontFamily: 'Outfit, sans-serif', lineHeight: 1.3 }}>{item.title}</div>
              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.75 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '34px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '12px' }}>Business outcomes</div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>
            Built to drive commercial results, not just conversations
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {OUTCOMES.map((item) => (
            <div key={item.title} className="card" style={{ borderColor: '#1E2028' }}>
              <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{item.title}</div>
              <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '12px' }}>Pricing</div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>Pricing that scales with conversations</h2>
          <p style={{ marginTop: '10px', color: '#9CA3AF', fontSize: '15px' }}>Choose the plan that fits your traffic, support load, and growth stage.</p>
          <p style={{ marginTop: '8px', color: '#6B7280', fontSize: '13px' }}>For many teams, a few recovered conversations or saved support hours can cover the monthly plan.</p>
        </div>
        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {PRICING.map((plan) => (
            <div key={plan.name} className="card" style={{ border: plan.popular ? '2px solid #AAFF00' : undefined, position: 'relative', paddingTop: plan.popular ? '32px' : '20px' }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#AAFF00', color: '#080A0E', fontSize: '10px', fontWeight: 900, padding: '4px 16px', borderRadius: '20px', whiteSpace: 'nowrap', fontFamily: 'Outfit, sans-serif' }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>{plan.name}</div>
              <div style={{ fontSize: '12px', color: '#D1D5DB', marginBottom: '14px' }}>{plan.bestFor}</div>
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
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280', marginTop: '24px' }}>All prices in USD. 14-day free trial. Cancel anytime.</p>
      </section>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '10px' }}>Customer proof</div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>Teams using Questme trust the answers</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[
            {
              initials: 'SL',
              name: 'Sarah Lim',
              role: 'Head of Growth, Aster Goods',
              quote: 'We cut repetitive pre-sales questions and kept buying intent moving on product pages.',
            },
            {
              initials: 'AM',
              name: 'Ahmed Malik',
              role: 'Support Lead, Northlane SaaS',
              quote: 'Questme gave our team breathing room by handling common plan and onboarding questions 24/7.',
            },
            {
              initials: 'TB',
              name: 'Tom Bradley',
              role: 'Founder, Fieldstone Services',
              quote: 'Visitors get immediate answers and we capture better-qualified leads without adding headcount.',
            },
          ].map((item) => (
            <div key={item.name} className="card" style={{ borderColor: '#1E2028' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#AAFF00', color: '#080A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', fontFamily: 'Outfit, sans-serif' }}>
                  {item.initials}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F0F0F0' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{item.role}</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#D1D5DB', lineHeight: 1.7 }}>{item.quote}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <div className="cta-inner" style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '60px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 6vw, 40px)', fontWeight: 900, marginBottom: '16px', letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif' }}>
            Ready to answer visitors faster<br /><span style={{ color: '#AAFF00' }}>and capture more intent?</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '32px' }}>Launch your business knowledge bot, reduce repetitive support work, and keep your website responsive around the clock.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 24px' }}>
              Capture more leads with AI answers
            </Link>
            <a href="#pricing" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 32px' }}>See pricing</a>
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
          thumbnailUrl: 'https://img.youtube.com/vi/p5UDyeLil6I/maxresdefault.jpg',
          uploadDate: '2026-03-31',
          contentUrl: 'https://www.youtube.com/watch?v=p5UDyeLil6I',
          embedUrl: 'https://www.youtube.com/embed/p5UDyeLil6I',
          publisher: {
            '@type': 'Organization',
            name: 'Questme.ai',
            url: 'https://questme.ai'
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
              a: 'Questme.ai is an AI chatbot platform for business websites. You train it on your own product and service knowledge so visitors get instant answers 24/7.',
            },
            {
              q: 'How does the AI chatbot learn about my business?',
              a: 'You upload documents, paste website URLs, or add FAQs directly in the dashboard. Questme indexes this content so your bot answers from your business knowledge.',
            },
            {
              q: 'What happens if the chatbot can\'t answer a question?',
              a: 'If the bot has no matching answer, it can respond transparently and trigger a handoff so your team can follow up and keep the conversation moving.',
            },
            {
              q: 'Can I embed the chatbot on any website?',
              a: 'Yes. Questme generates a single script tag that works on any website — Shopify, Webflow, WordPress, or custom HTML. No developer needed.',
            },
            {
              q: 'Is there a free trial?',
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

      <footer style={{ borderTop: '1px solid #1E2028', padding: '44px 24px 28px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '24px', height: '24px', background: '#AAFF00', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '12px', color: '#080A0E', fontFamily: 'Outfit, sans-serif' }}>Q</div>
              <span style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'Outfit, sans-serif' }}>Questme<span style={{ color: '#AAFF00' }}>.ai</span></span>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.7 }}>AI product knowledge bots for businesses</p>
          </div>

          <div>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#9CA3AF', marginBottom: '10px' }}>Product</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="#features" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Features</a>
              <a href="#pricing" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Pricing</a>
              <a href="/blog" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Blog</a>
              <a href="/sign-up" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Start free</a>
            </div>
          </div>

          <div>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#9CA3AF', marginBottom: '10px' }}>Resources</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="/ai-customer-support-chatbot" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>AI Customer Support Chatbot</a>
              <a href="/ai-product-knowledge-chatbot" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>AI Product Knowledge Chatbot</a>
              <a href="/website-ai-chatbot-for-lead-generation" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Website Chatbot for Lead Generation</a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1E2028', paddingTop: '16px' }}>
          <span style={{ fontSize: '13px', color: '#6B7280' }}>© 2026 Questme.ai — Built for product-led businesses · All prices in USD</span>
        </div>
      </footer>

      {showMobileCta && (
        <div className="mobile-sticky-cta" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 80, background: '#080A0E', borderTop: '1px solid rgba(255,255,255,0.1)', height: '60px', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#F0F0F0' }}>Questme</div>
          <Link href="/sign-up" className="btn-accent" style={{ padding: '10px 18px', fontSize: '14px', fontWeight: 700, borderRadius: '10px' }}>
            Start Free
          </Link>
        </div>
      )}
    </div>
  )
}
