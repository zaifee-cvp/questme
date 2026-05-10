'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowRight, ArrowUp, BarChart3, BookOpen, Check, Code2, MailX, Minus, Play, UserPlus, Zap } from 'lucide-react'
import { PageWash } from '@/components/effects/PageWash'
import { TiltCard } from '@/components/effects/TiltCard'

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
    <div style={{ minHeight: '100vh', color: '#F0F0F0' }}>
      <PageWash accent="lime" />
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

      <section ref={heroRef} className="relative pt-12 md:pt-20 pb-20 md:pb-32 overflow-hidden font-sans">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[900px] bg-[radial-gradient(ellipse_at_center,_rgba(170,255,0,0.14)_0%,_rgba(170,255,0,0.04)_30%,_transparent_60%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">

            <div>
              <div className="inline-flex items-center gap-2 mb-7">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-400"></span>
                </span>
                <span className="text-xs text-zinc-400 uppercase tracking-[0.2em] font-medium">AI answers for any website</span>
              </div>

              <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.02] text-balance">
                Answer every visitor question. <span className="text-[#AAFF00] whitespace-nowrap">Right when</span> they ask.
              </h1>

              <p className="mt-7 text-lg md:text-xl text-zinc-400 leading-relaxed max-w-xl">
                Questme reads your docs, FAQs, and product pages, then answers visitor questions on your website in under 2 seconds &mdash; with citations from your own content. No hallucinations. No support ticket backlog.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link href="/sign-up" className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg bg-[#AAFF00] hover:bg-lime-300 transition-colors text-zinc-950 font-medium">
                  Add to my website &mdash; free
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link href="#how" className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/50 transition-colors text-white font-medium">
                  <Play className="w-4 h-4" />
                  See it answer
                </Link>
              </div>

              <p className="mt-6 text-xs text-zinc-500">
                14-day free trial &middot; No credit card &middot; Install in 60 seconds
              </p>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[380px] rotate-[-1.5deg]">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-lime-400/10 overflow-hidden">

                  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800/60 bg-gradient-to-b from-zinc-900 to-zinc-950">
                    <div className="w-9 h-9 rounded-lg bg-[#AAFF00] flex items-center justify-center flex-shrink-0">
                      <span className="text-zinc-950 font-bold text-sm">Q</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">Questme</p>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                        <p className="text-[11px] text-zinc-400">Online &middot; Replies in &lt;2s</p>
                      </div>
                    </div>
                    <button type="button" aria-label="Minimize" className="text-zinc-600 hover:text-zinc-400">
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="px-4 py-5 space-y-3 min-h-[440px] bg-zinc-950">

                    <div className="flex">
                      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-800/80 px-3.5 py-2.5">
                        <p className="text-[13px] text-zinc-100 leading-snug">Does Questme work on Shopify?</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-lime-400/10 border border-lime-400/20 px-3.5 py-2.5">
                        <p className="text-[13px] text-zinc-100 leading-snug">Yes &mdash; Questme installs on Shopify with one line of code in your theme.liquid file. Setup takes ~2 minutes. Want the install snippet?</p>
                        <div className="mt-2.5 pt-2.5 border-t border-lime-400/15 flex flex-wrap items-center gap-1.5">
                          <span className="text-[9px] uppercase tracking-[0.18em] text-lime-400/80 font-semibold">Sources</span>
                          <span className="text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-800/60 border border-zinc-700/50">docs.questme.ai/shopify</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-800/80 px-3.5 py-2.5">
                        <p className="text-[13px] text-zinc-100 leading-snug">Yes please. Also &mdash; how much for 10K queries/month?</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-lime-400/10 border border-lime-400/20 px-3.5 py-2.5">
                        <p className="text-[13px] text-zinc-100 leading-snug">10K queries/month is the Pro plan at $88/mo. I&rsquo;ll DM you the install snippet now &mdash; what&rsquo;s your store URL?</p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="rounded-2xl rounded-tl-sm bg-zinc-800/80 px-3.5 py-2.5 inline-flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{animationDelay: '0ms'}}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{animationDelay: '150ms'}}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{animationDelay: '300ms'}}></span>
                      </div>
                    </div>

                  </div>

                  <div className="flex items-center gap-2 px-4 py-3 border-t border-zinc-800/60 bg-zinc-900/60">
                    <div className="flex-1 px-3 py-2 rounded-lg bg-zinc-800/60 text-xs text-zinc-500">
                      Ask a question&hellip;
                    </div>
                    <button type="button" aria-label="Send message" className="w-8 h-8 rounded-lg bg-[#AAFF00] flex items-center justify-center flex-shrink-0">
                      <ArrowUp className="w-3.5 h-3.5 text-zinc-950" />
                    </button>
                  </div>
                </div>

                <div className="absolute -top-3 -left-3 rounded-full border border-lime-400/30 bg-zinc-950/90 backdrop-blur px-3 py-1.5 flex items-center gap-1.5 rotate-[1.5deg]">
                  <Zap className="w-3 h-3 text-lime-400" />
                  <span className="text-[10px] font-mono text-zinc-300 tracking-tight">Answered in 1.4s</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 border-y border-zinc-800/50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-[0.18em] text-zinc-500 font-medium mb-8">
            Built for
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-12">
            <span className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Ecommerce stores</span>
            <span className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">SaaS &amp; product teams</span>
            <span className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Service businesses</span>
            <span className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Documentation sites</span>
            <span className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Knowledge bases</span>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-[0.18em] font-medium mb-6">
                The cost of silence
              </p>
              <h2 className="font-sans text-4xl md:text-5xl tracking-tight font-semibold text-white leading-[1.05] text-balance">
                Visitors don&rsquo;t email you. They <span className="text-[#AAFF00]">leave</span>.
              </h2>
              <p className="mt-6 text-lg text-zinc-400 leading-relaxed max-w-xl">
                Most product questions arrive at 11pm on a Sunday. Your support team is offline. Your docs are buried four clicks deep. The visitor closes the tab and buys from someone whose website actually answered them.
              </p>

              <ul className="mt-10 space-y-6">
                <li className="flex gap-5">
                  <span className="font-mono text-sm text-zinc-600 pt-1 flex-shrink-0">01</span>
                  <div>
                    <h3 className="font-sans text-base font-medium text-white">Visitors don&rsquo;t fill out contact forms</h3>
                    <p className="mt-1 text-sm text-zinc-400 leading-relaxed">If they have to type their email to ask a question, 90% bounce. They came to research, not commit.</p>
                  </div>
                </li>
                <li className="flex gap-5">
                  <span className="font-mono text-sm text-zinc-600 pt-1 flex-shrink-0">02</span>
                  <div>
                    <h3 className="font-sans text-base font-medium text-white">Your docs are not the answer</h3>
                    <p className="mt-1 text-sm text-zinc-400 leading-relaxed">Even great documentation requires the visitor to search, scan, and synthesize. They want a 1-line answer to a 1-line question.</p>
                  </div>
                </li>
                <li className="flex gap-5">
                  <span className="font-mono text-sm text-zinc-600 pt-1 flex-shrink-0">03</span>
                  <div>
                    <h3 className="font-sans text-base font-medium text-white">Generic chatbots hallucinate &mdash; and lose trust</h3>
                    <p className="mt-1 text-sm text-zinc-400 leading-relaxed">A bot that confidently invents a feature you don&rsquo;t have is worse than no bot. Trust gets burned, returns spike.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(170,255,0,0.10)_0%,_transparent_70%)] pointer-events-none" />

              <div className="relative space-y-3">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 opacity-70">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center flex-shrink-0">
                      <MailX className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-[0.18em]">Without Questme</p>
                      <p className="text-sm font-medium text-zinc-300">Contact form &amp; email</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Visitor question &rarr; contact form ignored &rarr; visitor leaves
                  </p>
                  <div className="mt-5 pt-4 border-t border-zinc-800/50 flex items-baseline justify-between">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-[0.18em]">Time to answer</span>
                    <span className="font-mono text-3xl font-semibold text-zinc-400">Hours</span>
                  </div>
                </div>

                <div className="flex justify-center py-1">
                  <ArrowDown className="w-4 h-4 text-zinc-700" />
                </div>

                <div className="rounded-2xl border border-lime-400/30 bg-lime-400/[0.04] ring-1 ring-lime-400/20 p-6 shadow-2xl shadow-lime-400/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-lime-400/15 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-lime-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-lime-400 uppercase tracking-[0.18em]">With Questme</p>
                      <p className="text-sm font-medium text-white">AI grounded in your content</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Visitor asks &rarr; AI answers from your docs &rarr; lead captured if relevant
                  </p>
                  <div className="mt-5 pt-4 border-t border-lime-400/20 flex items-baseline justify-between">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-[0.18em]">Time to answer</span>
                    <span className="font-mono text-3xl font-semibold text-lime-400">&lt;2s</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
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

      <section id="features" className="py-20 md:py-32 border-y border-zinc-800/50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl mb-16">
            <p className="text-xs text-zinc-500 uppercase tracking-[0.18em] font-medium mb-6">
              What you get
            </p>
            <h2 className="font-sans text-4xl md:text-5xl tracking-tight font-semibold text-white leading-[1.05] text-balance">
              Everything your support team does &mdash; instantly, on every page.
            </h2>
            <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
              Read your content, answer any question, capture lead intent, integrate with your stack. One widget on every page that actually closes the answer loop.
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">

            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 md:p-10 hover:border-zinc-700 transition-colors overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(170,255,0,0.06)_0%,_transparent_60%)] pointer-events-none" />

              <div className="relative max-w-2xl">
                <div className="w-14 h-14 rounded-xl bg-lime-400/10 flex items-center justify-center mb-6">
                  <BookOpen className="w-7 h-7 text-lime-400" />
                </div>
                <h3 className="font-sans text-2xl md:text-3xl font-semibold text-white tracking-tight leading-[1.15]">
                  Grounded in your content. Zero hallucinations.
                </h3>
                <p className="mt-4 text-base text-zinc-400 leading-relaxed">
                  Point Questme at your URL, docs site, FAQs, or PDFs. We index everything, then answer visitor questions with citations from your own content. The AI never invents features, prices, or policies. Every answer traces back to a source you control.
                </p>
                <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  <li className="flex items-start gap-2 text-sm text-zinc-400"><Check className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />Answers under 2 seconds</li>
                  <li className="flex items-start gap-2 text-sm text-zinc-400"><Check className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />Source citations on every answer</li>
                  <li className="flex items-start gap-2 text-sm text-zinc-400"><Check className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />Re-indexes on content updates</li>
                  <li className="flex items-start gap-2 text-sm text-zinc-400"><Check className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />Refuses out-of-scope questions</li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 md:gap-6">

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-lime-400/10 flex items-center justify-center mb-4">
                  <Code2 className="w-5 h-5 text-lime-400" />
                </div>
                <h3 className="font-sans text-lg font-medium text-white">One-line install</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  Drop one script tag. Works on Shopify, WordPress, Webflow, Framer, Next.js, plain HTML. No backend changes, no plugins.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-lime-400/10 flex items-center justify-center mb-4">
                  <UserPlus className="w-5 h-5 text-lime-400" />
                </div>
                <h3 className="font-sans text-lg font-medium text-white">Capture qualified leads</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  When a visitor shows buying intent (&ldquo;how do I subscribe?&rdquo;, &ldquo;what&rsquo;s the API limit?&rdquo;), Questme captures their email and routes the lead to your inbox.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-lime-400/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5 text-lime-400" />
                </div>
                <h3 className="font-sans text-lg font-medium text-white">See what visitors actually ask</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  Every question is logged. Spot content gaps, ship better docs, and watch Questme answer 95%+ of repeat questions automatically.
                </p>
              </div>

            </div>
          </div>
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
            <TiltCard key={s.n} className="group relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl shadow-black/40 transition-colors hover:border-lime-400/30 hover:bg-white/[0.04] p-5">
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#AAFF00', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>{s.n}</div>
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{s.title}</div>
              <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.6 }}>{s.desc}</div>
            </TiltCard>
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
            <TiltCard key={item.q} className="group relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl shadow-black/40 transition-colors hover:border-lime-400/30 hover:bg-white/[0.04] p-5">
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '10px', fontFamily: 'Outfit, sans-serif', color: '#F0F0F0' }}>{item.q}</div>
              <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.7 }}>{item.a}</div>
            </TiltCard>
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
