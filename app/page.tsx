'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowRight, ArrowUp, BarChart3, BookOpen, Check, Code2, MailX, Minus, Play, UserPlus, Zap } from 'lucide-react'
import { PageWash } from '@/components/effects/PageWash'
import { TiltCard } from '@/components/effects/TiltCard'

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

      <section id="demo" className="py-20 md:py-32 border-y border-zinc-800/50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl mb-12">
            <p className="text-xs text-zinc-500 uppercase tracking-[0.18em] font-medium mb-6">
              Walkthrough
            </p>
            <h2 className="font-sans text-4xl md:text-5xl tracking-tight font-semibold text-white leading-[1.05] text-balance">
              See it answer a real product question.
            </h2>
            <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
              Watch Questme read a docs site, answer a visitor&rsquo;s question with citations, and capture the lead &mdash; in under 90 seconds.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-lime-400/10">
            <iframe
              className="w-full aspect-video block"
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

      <section id="pricing" className="py-20 md:py-32 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl mb-16">
            <p className="text-xs text-zinc-500 uppercase tracking-[0.18em] font-medium mb-6">
              Pricing
            </p>
            <h2 className="font-sans text-4xl md:text-5xl tracking-tight font-semibold text-white leading-[1.05] text-balance">
              One closed answer covers the cost.
            </h2>
            <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
              14-day free trial. No credit card. Cancel anytime in one click.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">

            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-medium mb-3">Starter</p>
                <h3 className="font-sans text-2xl font-semibold text-white tracking-tight">Solo operators</h3>
              </div>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-sm text-zinc-500">$</span>
                <span className="font-mono text-5xl font-semibold text-white">68</span>
                <span className="text-sm text-zinc-500 ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {['1 bot', '500 chats/month', '50 pages indexed', 'Embeddable widget', 'URL, text, FAQ sources', 'Shareable link'].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 text-white font-medium text-sm w-full">
                Start free trial
              </Link>
            </div>

            <div className="relative rounded-2xl border border-zinc-800 ring-2 ring-lime-400/40 bg-zinc-900/60 p-8 flex flex-col">
              <div className="absolute -top-3 left-6 px-2.5 py-1 rounded-full bg-[#AAFF00] text-[10px] uppercase tracking-[0.18em] font-medium text-zinc-950">
                Recommended
              </div>
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-lime-400 font-medium mb-3">Pro</p>
                <h3 className="font-sans text-2xl font-semibold text-white tracking-tight">Growing teams</h3>
              </div>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-sm text-zinc-500">$</span>
                <span className="font-mono text-5xl font-semibold text-white">128</span>
                <span className="text-sm text-zinc-500 ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {['3 bots', '2,000 chats/month', '200 pages indexed', 'Lead capture', 'Knowledge gap analytics', 'Human handoff email', 'PDF file upload'].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-[#AAFF00] hover:bg-lime-300 text-zinc-950 font-medium text-sm w-full">
                Start free trial
              </Link>
            </div>

            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-medium mb-3">Scale</p>
                <h3 className="font-sans text-2xl font-semibold text-white tracking-tight">Multi-brand sites</h3>
              </div>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-sm text-zinc-500">$</span>
                <span className="font-mono text-5xl font-semibold text-white">248</span>
                <span className="text-sm text-zinc-500 ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {['Unlimited bots', '10,000 chats/month', 'Unlimited pages', 'All Pro features', 'Weekly digest email', 'Priority support'].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-lime-400 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 text-white font-medium text-sm w-full">
                Start free trial
              </Link>
            </div>

          </div>

          <div className="mt-12 text-center space-y-3">
            <p className="text-sm text-zinc-500">
              All plans include zero-hallucination guarantee, source citations on every answer, and unlimited content re-indexing.
            </p>
            <p className="text-xs text-zinc-600">
              All prices in USD &middot; 14-day free trial on all plans &middot; No credit card required
            </p>
          </div>

        </div>
      </section>

      <section className="py-24 md:py-40 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">

            <h2 className="font-sans text-4xl md:text-6xl tracking-tight font-semibold text-white leading-[1.02] text-balance">
              Stop losing visitors to silence. <span className="text-[#AAFF00]">Start answering.</span>
            </h2>

            <p className="mt-6 text-lg text-zinc-400 leading-relaxed">
              One script tag. 60-second setup. Every visitor question answered in under 2 seconds, with citations from your own content. Free 14-day trial.
            </p>

            <div className="mt-10 flex justify-center">
              <Link
                href="/sign-up"
                className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg bg-[#AAFF00] hover:bg-lime-300 transition-colors text-zinc-950 font-medium"
              >
                Add to my website &mdash; free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <p className="mt-5 text-xs text-zinc-500">
              No credit card &middot; Setup in 60 seconds &middot; Cancel anytime
            </p>

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

      <section id="faq" className="py-20 md:py-32 border-y border-zinc-800/50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl mb-16">
            <p className="text-xs text-zinc-500 uppercase tracking-[0.18em] font-medium mb-6">
              FAQ
            </p>
            <h2 className="font-sans text-4xl md:text-5xl tracking-tight font-semibold text-white leading-[1.05] text-balance">
              Questions builders actually ask.
            </h2>
          </div>

          <div className="max-w-3xl divide-y divide-zinc-800/60">

            <div className="py-8 first:pt-0">
              <h3 className="font-sans text-lg font-medium text-white">How does Questme avoid hallucinations?</h3>
              <p className="mt-3 text-base text-zinc-400 leading-relaxed">
                Questme only answers from content you give it &mdash; your URL, docs, FAQs, PDFs. If a visitor asks something outside your indexed content, the AI says so and offers to capture the question for you to answer later. Every answer includes a source citation that links back to your own page.
              </p>
            </div>

            <div className="py-8">
              <h3 className="font-sans text-lg font-medium text-white">What platforms does Questme work on?</h3>
              <p className="mt-3 text-base text-zinc-400 leading-relaxed">
                Any website that lets you embed a script tag. We&rsquo;ve tested it on Shopify, WordPress, Webflow, Framer, Next.js, and plain HTML. Setup is one line of code &mdash; no backend changes, no plugins, no data migration.
              </p>
            </div>

            <div className="py-8">
              <h3 className="font-sans text-lg font-medium text-white">How does it index my content?</h3>
              <p className="mt-3 text-base text-zinc-400 leading-relaxed">
                Point it at your URL or upload PDFs. Questme crawls the pages, extracts the readable content, and builds an embedding index. Re-indexing happens automatically on a schedule, or you can trigger it manually after a content update.
              </p>
            </div>

            <div className="py-8">
              <h3 className="font-sans text-lg font-medium text-white">Can I capture leads from chat conversations?</h3>
              <p className="mt-3 text-base text-zinc-400 leading-relaxed">
                Yes. When a visitor shows buying intent &mdash; questions about pricing, demos, integrations, or signup &mdash; Questme prompts them for an email and routes the lead to your inbox. You see the full conversation context with every lead.
              </p>
            </div>

            <div className="py-8">
              <h3 className="font-sans text-lg font-medium text-white">What happens to questions Questme can&rsquo;t answer?</h3>
              <p className="mt-3 text-base text-zinc-400 leading-relaxed">
                They get logged in your dashboard as &ldquo;content gaps.&rdquo; You can write a new doc page or FAQ entry, re-index, and the next visitor with the same question gets an instant answer. The bot teaches you what your docs are missing.
              </p>
            </div>

            <div className="py-8">
              <h3 className="font-sans text-lg font-medium text-white">Is my visitors&rsquo; data safe?</h3>
              <p className="mt-3 text-base text-zinc-400 leading-relaxed">
                Conversations are stored encrypted on our infrastructure. We don&rsquo;t train on your visitor data. You can delete conversation history anytime, and EU/UK customers can request a data processing addendum.
              </p>
            </div>

            <div className="py-8 last:pb-0">
              <h3 className="font-sans text-lg font-medium text-white">How long does setup take?</h3>
              <p className="mt-3 text-base text-zinc-400 leading-relaxed">
                About 60 seconds. Sign up, paste your website URL, drop one script tag in your site&rsquo;s &lt;head&gt;. The first crawl finishes in 2&ndash;5 minutes for most sites. Then you&rsquo;re live.
              </p>
            </div>

          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800/50 py-16 md:py-20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid md:grid-cols-3 gap-10 md:gap-16">

            <div className="md:max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-md bg-[#AAFF00] flex items-center justify-center">
                  <span className="text-zinc-950 font-bold text-sm">Q</span>
                </div>
                <span className="text-base font-semibold text-white tracking-tight">
                  Questme<span className="text-[#AAFF00]">.ai</span>
                </span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">
                AI that answers visitor questions on your website &mdash; grounded in your content, citations on every answer, leads captured automatically.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-medium mb-4">Product</p>
              <ul className="space-y-3">
                <li><Link href="/#features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/#demo" className="text-sm text-zinc-400 hover:text-white transition-colors">Watch demo</Link></li>
                <li><Link href="/#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/#faq" className="text-sm text-zinc-400 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/blog" className="text-sm text-zinc-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/sign-up" className="text-sm text-zinc-400 hover:text-white transition-colors">Start free trial</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 font-medium mb-4">Company</p>
              <ul className="space-y-3">
                <li><Link href="/sign-in" className="text-sm text-zinc-400 hover:text-white transition-colors">Log in</Link></li>
                <li><a href="mailto:support@cvidsproductions.net" className="text-sm text-zinc-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

          </div>

          <div className="mt-16 pt-8 border-t border-zinc-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="font-mono text-xs text-zinc-600 tracking-tight">
              &copy; 2026 QUESTME.AI &middot; A C-Vids Productions tool &middot; Built in Singapore
            </p>
            <p className="font-mono text-xs text-zinc-600 tracking-tight">
              AI answers v2.0
            </p>
          </div>

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
