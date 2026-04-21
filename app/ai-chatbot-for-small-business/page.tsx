import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Chatbot for Small Business | Questme.ai',
  description: 'Questme.ai gives small businesses an AI chatbot that answers customer questions automatically — affordable, easy to set up, and available around the clock.',
  alternates: { canonical: 'https://questme.ai/ai-chatbot-for-small-business' },
}

export default function AIChatbotForSmallBusiness() {
  return (
    <div style={{ minHeight: '100vh', background: '#080A0E', color: '#F0F0F0' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1E2028', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1100px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: '32px', height: '32px', background: '#AAFF00', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '16px', color: '#080A0E', fontFamily: 'Outfit, sans-serif' }}>Q</div>
          <span style={{ fontWeight: 700, fontSize: '18px', fontFamily: 'Outfit, sans-serif' }}>Questme<span style={{ color: '#AAFF00' }}>.ai</span></span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/blog" style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none' }}>Blog</Link>
          <Link href="/sign-in" style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/sign-up" className="btn-accent" style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '8px' }}>Start free trial</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '72px 24px 48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', color: '#9CA3AF', marginBottom: '28px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#AAFF00', display: 'inline-block' }}></span>
          AI Support for Small Teams
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1.5px', fontFamily: 'Outfit, sans-serif' }}>
          Give customers instant answers<br />
          <span style={{ color: '#AAFF00' }}>without growing your team</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px', maxWidth: '620px' }}>
          Questme helps small businesses respond faster, reduce repetitive support work, and capture more customer intent from every website visit.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['Made for SME budgets', 'Answers from your business knowledge', 'No technical setup needed'].map((pill) => (
            <span key={pill} style={{ fontSize: '12px', color: '#D1D5DB', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '999px', padding: '6px 12px' }}>
              {pill}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 32px' }}>Start free trial</Link>
          <Link href="/" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 32px' }}>See platform overview</Link>
        </div>
      </section>

      {/* Content */}
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px' }}>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Why Small Businesses Need an AI Chatbot Now
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Small business owners wear every hat. You're handling operations, marketing, sales, and customer support — often at the same time. When a customer sends a question at 9pm asking about your products, pricing, or availability, you have a choice: respond late and risk losing them, or be glued to your phone after hours.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Neither option is sustainable. An AI chatbot gives you a third option: automatic, accurate responses the moment a customer reaches out — whether you're sleeping, in a meeting, or focused on running your business. You stop losing potential customers to slow response times without hiring anyone new.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            What Questme.ai Does for Small Business Owners
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Questme.ai trains an AI on your specific business content — your products, services, pricing, FAQs, and policies. Once trained, the bot handles customer questions automatically on your website and WhatsApp, giving accurate answers drawn from your own knowledge base.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            It's not a generic FAQ page. It's a conversational AI that understands natural language questions and finds the right answer from your content. Customers type questions the way they think of them and get helpful responses within seconds.
          </p>
          <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#F0F0F0', marginBottom: '10px', marginTop: '24px' }}>
            What can the bot answer for your customers?
          </h3>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Product details, service pricing, opening hours, delivery options, return policies, booking availability — any information you've uploaded. The bot handles the repetitive questions so you can focus on the ones that actually need your attention.
          </p>
        </section>

        <section style={{ marginBottom: '56px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            No Tech Team Required — Set Up in Minutes
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Most enterprise software requires onboarding, developer support, and weeks of configuration. Questme.ai is different. You sign up, paste in your website URLs or upload your documents, and the AI indexes your content automatically.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Adding the chatbot to your website takes one copy-paste of a script tag. It works on any website platform — Shopify, WordPress, Wix, Webflow, or a custom site. No plugins to install, no code to write, no developer to hire.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            From sign-up to live chatbot: under 10 minutes. That's designed specifically for business owners who have more important things to do than figure out complicated software.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Handle Customer Questions Without Hiring More Staff
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Hiring a part-time customer support person costs money every month, plus training time, management overhead, and the inevitable inconsistency of human responses. An AI chatbot costs a fraction of that, requires no training beyond uploading your content, and delivers consistent answers every single time.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            And when a question comes in that genuinely needs a human — something complex, a complaint that needs empathy, or a sales conversation — Questme.ai includes a human handoff feature. Trigger words like "speak to someone" automatically escalate the chat to your team via email, so nothing important slips through.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Affordable Plans Built for Small Business Budgets
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Enterprise AI tools come with enterprise price tags. Questme.ai pricing starts low enough that a small business can justify the cost from a single converted lead — and the time savings alone typically make it worthwhile within the first week.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            There's a free plan to start, with paid plans that scale as your business grows. No long-term contracts, no setup fees, no surprise charges. You pay for what you use.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            What Types of Small Businesses Benefit Most
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '20px' }}>
            Questme.ai is a good fit for any small business that regularly gets inbound customer questions. Some common examples:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {[
              { icon: '🛍️', label: 'E-commerce stores', desc: 'Product specs, sizing, shipping, returns' },
              { icon: '🏥', label: 'Clinics & salons', desc: 'Services, pricing, availability, booking' },
              { icon: '🏢', label: 'Service businesses', desc: 'Packages, timelines, process questions' },
              { icon: '🍽️', label: 'F&B businesses', desc: 'Menu, allergens, hours, reservations' },
              { icon: '🎓', label: 'Education providers', desc: 'Course details, fees, enrollment info' },
              { icon: '🔧', label: 'Trade & home services', desc: 'Service areas, pricing, how to book' },
            ].map(item => (
              <div key={item.label} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.4 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Launch your small business AI assistant<br /><span style={{ color: '#AAFF00' }}>in minutes</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
            Keep customer conversations moving with instant answers while you focus on running the business.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 36px' }}>Start free trial</Link>
            <Link href="/" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 28px' }}>See pricing</Link>
          </div>
          <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '16px' }}>14-day free trial · No credit card required</p>
        </section>

      </article>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1E2028', padding: '32px 24px', maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: '24px', height: '24px', background: '#AAFF00', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '12px', color: '#080A0E', fontFamily: 'Outfit, sans-serif' }}>Q</div>
          <span style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'Outfit, sans-serif' }}>Questme<span style={{ color: '#AAFF00' }}>.ai</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/blog" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Blog</Link>
          <Link href="/ai-customer-support-chatbot" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Customer Support Bot</Link>
          <Link href="/website-ai-chatbot-for-lead-generation" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Lead Gen Bot</Link>
        </div>
      </footer>

    </div>
  )
}
