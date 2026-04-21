import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Automated Customer Enquiry System | Questme.ai',
  description: 'Questme.ai is an automated customer enquiry system that handles inbound questions on WhatsApp and your website — trained on your own business data.',
  alternates: { canonical: 'https://questme.ai/automated-customer-enquiry-system' },
}

export default function AutomatedCustomerEnquirySystem() {
  return (
    <div style={{ minHeight: '100vh', background: '#080A0E', color: '#F0F0F0' }}>
      <style>{`
        @media (max-width: 639px) {
          .hero-wrap { padding-top: 56px !important; padding-bottom: 40px !important; }
          .hero-h1 { letter-spacing: -0.8px !important; }
          .hero-sub { font-size: 16px !important; line-height: 1.65 !important; }
          .hero-actions { width: 100%; }
          .hero-actions > * { width: 100%; justify-content: center; }
          .seo-article { padding-bottom: 56px !important; }
          .seo-article section { margin-bottom: 40px !important; }
          .seo-article h2 { font-size: 24px !important; line-height: 1.25 !important; }
        }
      `}</style>

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
      <section className="hero-wrap" style={{ maxWidth: '800px', margin: '0 auto', padding: '72px 24px 48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', color: '#9CA3AF', marginBottom: '28px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#AAFF00', display: 'inline-block' }}></span>
          AI Enquiry Response System
        </div>
        <h1 className="hero-h1" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1.5px', fontFamily: 'Outfit, sans-serif' }}>
          Respond to every customer enquiry<br />
          <span style={{ color: '#AAFF00' }}>without delay</span>
        </h1>
        <p className="hero-sub" style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px', maxWidth: '620px' }}>
          Questme automates repetitive inbound questions across your website and WhatsApp so your team can focus on high-value conversations and conversions.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['24/7 response coverage', 'Built for SMEs and service teams', 'One knowledge base across channels'].map((pill) => (
            <span key={pill} style={{ fontSize: '12px', color: '#D1D5DB', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '999px', padding: '6px 12px' }}>
              {pill}
            </span>
          ))}
        </div>
        <div className="hero-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 32px' }}>Start free trial</Link>
          <Link href="/" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 32px' }}>See platform overview</Link>
        </div>
      </section>

      {/* Content */}
      <article className="seo-article" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px' }}>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            What Is an Automated Customer Enquiry System?
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            An automated customer enquiry system is a software solution that handles inbound questions from customers without requiring a human to respond manually. When a customer sends a message — through your website, WhatsApp, or another channel — the system reads the question, finds the most relevant answer from your business's knowledge base, and responds immediately.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            The key word is "automated." The system doesn't need a person behind it to function. It works continuously, handling as many simultaneous conversations as needed, with no delays and no shift changes.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            This is different from a ticketing system, which queues messages for human review, or a chatbot with scripted flows, which forces customers down predefined paths. A well-built automated enquiry system — like Questme.ai — understands natural language questions and responds from real business knowledge.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            How Questme.ai Automates Your Customer Enquiries
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '24px' }}>
            Questme.ai works in three stages:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {[
              { n: '01', title: 'You upload your business knowledge', desc: 'Product pages, service descriptions, FAQs, pricing documents, policies — any content that describes what your business offers. Questme.ai indexes it automatically.' },
              { n: '02', title: 'The AI learns and becomes your knowledge base', desc: "The system processes your content using vector search, so it can find the most relevant answer to any question — even when the phrasing doesn't exactly match what you wrote." },
              { n: '03', title: 'Customer questions are handled automatically', desc: 'When a customer asks a question on your website or WhatsApp, the AI retrieves the right answer and responds within seconds. No manual intervention needed.' },
            ].map(step => (
              <div key={step.n} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <span style={{ color: '#AAFF00', fontWeight: 900, fontSize: '20px', fontFamily: 'Outfit, sans-serif', flexShrink: 0, minWidth: '36px' }}>{step.n}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>{step.title}</div>
                  <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '56px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            From WhatsApp to Website — One System for All Channels
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Customer enquiries come in from multiple places. Some customers browse your website and ask questions there. Others message you on WhatsApp, which is the dominant business communication channel across Southeast Asia and many other markets.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Questme.ai works across both. One knowledge base — trained once on your content — powers your website chatbot and your WhatsApp channel simultaneously. Your customers get the same accurate answers regardless of how they reach you, and you manage everything from a single dashboard.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            This unified approach means you don't need to maintain separate systems, separate scripts, or separate teams for different channels. One source of truth for your business knowledge, deployed everywhere customers contact you.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Trained on Your FAQs, Products, and Service Details
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Generic automation tools give generic answers. Questme.ai is different because it operates from your actual business content. You're not filling in templates or configuring scripted responses — you're uploading what you already have, and the AI learns from it.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Accepted content formats include product page URLs (we crawl them automatically), PDF documents, FAQ text, and plain text. Once uploaded, the content is processed and becomes the source the AI draws from when answering questions.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            If the AI doesn't know the answer — because it's not in your knowledge base — it says so honestly and can route the customer to your team. Zero fabricated answers. This matters for maintaining trust with your customers.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Reduces Response Time from Hours to Seconds
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Response time is one of the most significant factors in whether a customer converts or moves on. Research consistently shows that leads followed up within the first few minutes are far more likely to become customers than those left waiting. For customer support, speed signals care and professionalism.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            With an automated enquiry system, your response time drops to near-zero. Every question gets answered the moment it arrives, not the next time someone checks the inbox. This improvement in speed directly impacts customer satisfaction and your conversion rate.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Which Businesses Benefit Most from Automation
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '20px' }}>
            Any business receiving a significant volume of inbound customer questions can benefit from automated enquiry handling. Particularly good fits include:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {[
              { icon: '🛒', title: 'E-commerce businesses', desc: 'High volumes of product, shipping, and return questions that repeat constantly' },
              { icon: '🏢', title: 'Service businesses', desc: 'Pricing, availability, process, and scope questions before clients commit' },
              { icon: '📱', title: 'SaaS and tech products', desc: 'Feature questions, how-to support, and plan comparisons at all hours' },
              { icon: '🏥', title: 'Healthcare and wellness', desc: 'Service details, appointment questions, and policy enquiries' },
              { icon: '🎓', title: 'Education providers', desc: 'Course information, fees, schedules, and enrollment questions' },
              { icon: '🏨', title: 'Hospitality and travel', desc: 'Availability, pricing, location, and facility questions from prospects' },
            ].map(item => (
              <div key={item.title} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.4 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Automate enquiry response<br /><span style={{ color: '#AAFF00' }}>and capture more value</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
            Launch your AI enquiry system quickly and keep customer conversations moving across every channel.
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
          <Link href="/whatsapp-ai-chatbot-for-business" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>WhatsApp Bot</Link>
        </div>
      </footer>

    </div>
  )
}
