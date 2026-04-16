'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ background: '#080A0E', color: '#F0F0F0', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1E2028', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#080A0EEE', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{ width: '28px', height: '28px', background: '#AAFF00', borderRadius: '7px', fontWeight: 900, fontSize: '14px', color: '#080A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>Q</div>
          <span style={{ fontWeight: 700, fontSize: '16px', fontFamily: 'Outfit, sans-serif', color: '#F0F0F0' }}>Questme<span style={{ color: '#AAFF00' }}>.ai</span></span>
        </Link>
        {/* Desktop links */}
        <div className="mk-nav-links" style={{ alignItems: 'center', gap: '24px' }}>
          <Link href="/features/ai-product-knowledge-bot" style={{ color: '#9CA3AF', fontSize: '14px', textDecoration: 'none' }}>Features</Link>
          <Link href="/blog" style={{ color: '#9CA3AF', fontSize: '14px', textDecoration: 'none' }}>Blog</Link>
          <Link href="/sign-in" style={{ color: '#9CA3AF', fontSize: '14px', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/sign-up" style={{ background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '13px', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
            Get Started Free →
          </Link>
        </div>
        {/* Mobile hamburger */}
        <button
          className="mk-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="5" width="18" height="2" rx="1" fill="currentColor" />
              <rect x="2" y="10" width="18" height="2" rx="1" fill="currentColor" />
              <rect x="2" y="15" width="18" height="2" rx="1" fill="currentColor" />
            </svg>
          )}
        </button>
      </nav>
      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mk-mobile-menu">
          <Link href="/features/ai-product-knowledge-bot" onClick={() => setMenuOpen(false)} style={{ fontSize: '15px', color: '#9CA3AF', textDecoration: 'none', padding: '4px 0' }}>Features</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} style={{ fontSize: '15px', color: '#9CA3AF', textDecoration: 'none', padding: '4px 0' }}>Blog</Link>
          <Link href="/sign-in" onClick={() => setMenuOpen(false)} style={{ fontSize: '15px', color: '#9CA3AF', textDecoration: 'none', padding: '4px 0' }}>Sign in</Link>
          <Link href="/sign-up" onClick={() => setMenuOpen(false)} style={{ background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '14px', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>
            Get Started Free →
          </Link>
        </div>
      )}

      {/* Page content */}
      {children}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1E2028', padding: '48px 24px', marginTop: '80px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '24px', height: '24px', background: '#AAFF00', borderRadius: '6px', fontWeight: 900, fontSize: '12px', color: '#080A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>Q</div>
              <span style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'Outfit, sans-serif' }}>Questme<span style={{ color: '#AAFF00' }}>.ai</span></span>
            </div>
            <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: 1.7, maxWidth: '220px' }}>AI product knowledge bots that answer customer questions 24/7.</p>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>Features</div>
            {[
              { href: '/features/ai-product-knowledge-bot', label: 'Product Knowledge Bot' },
              { href: '/features/embeddable-ai-chat-widget', label: 'Embeddable Chat Widget' },
              { href: '/features/ai-faq-bot-for-ecommerce', label: 'AI FAQ for E-commerce' },
              { href: '/features/customer-support-automation', label: 'Support Automation' },
              { href: '/features/product-catalog-ai-assistant', label: 'Catalogue AI Assistant' },
            ].map(({ href, label }) => (
              <div key={href} style={{ marginBottom: '8px' }}>
                <Link href={href} style={{ color: '#6B7280', fontSize: '13px', textDecoration: 'none' }}>{label}</Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>Resources</div>
            {[
              { href: '/blog', label: 'Blog' },
              { href: '/blog/what-is-a-product-knowledge-bot', label: 'What Is a Knowledge Bot?' },
              { href: '/blog/embed-ai-chat-on-website', label: 'How to Embed AI Chat' },
              { href: '/blog/chatbot-vs-knowledge-bot', label: 'Chatbot vs Knowledge Bot' },
            ].map(({ href, label }) => (
              <div key={href} style={{ marginBottom: '8px' }}>
                <Link href={href} style={{ color: '#6B7280', fontSize: '13px', textDecoration: 'none' }}>{label}</Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>Company</div>
            {[
              { href: '/sign-up', label: 'Get Started Free' },
              { href: '/sign-in', label: 'Sign In' },
            ].map(({ href, label }) => (
              <div key={href} style={{ marginBottom: '8px' }}>
                <Link href={href} style={{ color: '#6B7280', fontSize: '13px', textDecoration: 'none' }}>{label}</Link>
              </div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: '1100px', margin: '40px auto 0', paddingTop: '24px', borderTop: '1px solid #1E2028', fontSize: '12px', color: '#4B5563' }}>
          © {new Date().getFullYear()} Questme.ai — AI Product Knowledge Bots
        </div>
      </footer>
    </div>
  )
}
