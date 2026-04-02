import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'WhatsApp AI Chatbot for Business | Questme.ai',
  description: 'Deploy an AI chatbot on WhatsApp for your business. Questme.ai answers customer questions automatically via WhatsApp — trained on your own business data.',
  alternates: { canonical: 'https://www.questme.ai/whatsapp-ai-chatbot-for-business' },
}

export default function WhatsAppAIChatbotForBusiness() {
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
          <Link href="/sign-up" className="btn-accent" style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '8px' }}>Start free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '72px 24px 48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', color: '#9CA3AF', marginBottom: '28px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#AAFF00', display: 'inline-block' }}></span>
          WhatsApp Automation
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1.5px', fontFamily: 'Outfit, sans-serif' }}>
          WhatsApp AI Chatbot<br />
          <span style={{ color: '#AAFF00' }}>for Business</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px', maxWidth: '620px' }}>
          Your customers are already on WhatsApp. Questme.ai lets you deploy an AI chatbot that handles their questions automatically — trained on your own products and services, available every hour of every day.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 32px' }}>Start for free →</Link>
          <Link href="/" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 32px' }}>See how it works</Link>
        </div>
      </section>

      {/* Content */}
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px' }}>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Customers Already Use WhatsApp — Meet Them There
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            WhatsApp has over two billion users worldwide. In Southeast Asia, it's not just a messaging app — it's how people communicate with businesses. Customers message companies on WhatsApp to ask about products, check prices, and make enquiries, often expecting a response within minutes.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Most businesses can't keep up with that expectation manually. A single WhatsApp number monitored by one person can only handle so many conversations before response times slip. Missed messages mean missed opportunities. An AI chatbot on WhatsApp solves this at scale — handling every incoming message instantly, without delay.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            What a WhatsApp AI Chatbot Can Do for Your Business
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            A WhatsApp AI chatbot connected to Questme.ai acts as a knowledgeable assistant for your business — one that knows everything you've told it and responds immediately to incoming messages. It handles:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              'Product and service enquiries',
              'Pricing and availability questions',
              'Delivery and shipping questions',
              'Return and refund policy questions',
              'How-to and usage questions',
              'General business information',
            ].map(item => (
              <div key={item} className="card" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#AAFF00', fontWeight: 900, fontSize: '16px', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '14px', color: '#D1D5DB', lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            If a question falls outside what the bot knows, it flags it for your team rather than making something up — keeping your customers informed and your business reputation intact.
          </p>
        </section>

        <section style={{ marginBottom: '56px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Trained on Your Own Products and Services
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            The biggest difference between a useful WhatsApp chatbot and a frustrating one is whether it actually knows your business. Generic chatbots give generic answers. Questme.ai is trained exclusively on content you provide — your product pages, your catalogues, your service descriptions, your policies.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            This means when a customer asks "what's included in the Pro plan?" or "can I return this after 14 days?" or "do you deliver to Johor Bahru?" — the bot pulls the exact answer from your knowledge base and responds accurately. Not a generic redirect. Not a placeholder. The actual answer.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            You update your content any time — add new products, change pricing, update policies — and the bot reflects those changes automatically.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Handles Questions Automatically — Around the Clock
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Many customers send WhatsApp messages outside business hours — evenings, weekends, public holidays. With a human-only setup, those messages sit unanswered until someone checks the phone. By then, the customer may have moved on.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            With Questme.ai, your WhatsApp line is always active. Every message gets an immediate response. Customers get what they need at their convenience, not yours — and your business captures leads and answers questions that would otherwise be lost.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Works Alongside Your Existing WhatsApp Number
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            You don't need to change how your business operates. Questme.ai connects to your existing WhatsApp setup. The AI handles the routine questions automatically, and any conversation that needs human involvement can be escalated — a message like "speak to someone" or "I'd like to talk to a person" triggers a handoff to your team.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Your team still handles the conversations that matter most. The bot just removes the noise — the repetitive, answerable questions — so your team's time is spent where it genuinely makes a difference.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Why WhatsApp Is the Best Channel for Customer Support in Asia
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Across Singapore, Malaysia, Indonesia, Thailand, and much of Asia-Pacific, WhatsApp dominates business communication. Customers are already comfortable using it. They don't need to download a new app, create an account, or navigate a website chat widget.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Meeting customers on WhatsApp removes friction from the support experience. Lower friction means more enquiries answered, more leads captured, and better customer satisfaction. For businesses operating in this region, WhatsApp isn't just convenient — it's where your customers expect to find you.
          </p>
        </section>

        {/* CTA */}
        <section style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Set Up Your WhatsApp Business<br /><span style={{ color: '#AAFF00' }}>Chatbot Today</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
            Train the AI on your business, connect to WhatsApp, and start answering customer questions automatically — from day one.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 36px' }}>Start for free — no credit card</Link>
            <Link href="/" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 28px' }}>Learn more →</Link>
          </div>
          <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '16px' }}>Free plan available · No credit card required</p>
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
          <Link href="/ai-chatbot-for-small-business" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Small Business Bot</Link>
        </div>
      </footer>

    </div>
  )
}
