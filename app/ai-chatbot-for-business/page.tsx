import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Chatbot for Business | Questme.ai',
  description: 'Questme.ai is an AI chatbot for business that answers customer questions instantly — trained on your own data, available 24/7 on your website and WhatsApp.',
  alternates: { canonical: 'https://questme.ai/ai-chatbot-for-business' },
}

const TRUST_POINTS = [
  {
    title: 'Answers from your knowledge',
    desc: 'Questme responds from your business content, not generic public web text.',
  },
  {
    title: 'Transparent when no answer exists',
    desc: 'If your knowledge base does not contain an answer, the bot can state that clearly.',
  },
  {
    title: 'Human handoff ready',
    desc: 'Escalate sensitive or high-intent enquiries to your team when needed.',
  },
  {
    title: 'Fast launch, low setup friction',
    desc: 'Deploy quickly on your website and channels without heavy technical work.',
  },
]

const OUTCOMES = [
  'Convert more high-intent visitors before they drop',
  'Reduce repetitive support workload across your team',
  'Capture more qualified leads inside active conversations',
  'Stay responsive after hours without extra headcount',
]

export default function AIChatbotForBusiness() {
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
          AI Website Answers for Businesses
        </div>
        <h1 className="hero-h1" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1.5px', fontFamily: 'Outfit, sans-serif' }}>
          Stop losing leads to slow replies<br />
          <span style={{ color: '#AAFF00' }}>with business-trained AI answers</span>
        </h1>
        <p className="hero-sub" style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px', maxWidth: '620px' }}>
          Questme helps business websites answer customer questions instantly, reduce repetitive support load, and keep high-intent visitors moving toward action.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['For ecommerce stores', 'For SaaS and product teams', 'For service businesses', 'Website and WhatsApp ready'].map((pill) => (
            <span key={pill} style={{ fontSize: '12px', color: '#D1D5DB', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '999px', padding: '6px 12px' }}>
              {pill}
            </span>
          ))}
        </div>
        <div className="hero-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 32px' }}>Start free trial</Link>
          <Link href="/" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 32px' }}>See platform overview</Link>
        </div>
        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '12px' }}>Each delayed answer can cost a conversion. Questme replies in real time.</p>
      </section>

      <section style={{ maxWidth: '980px', margin: '0 auto', padding: '0 24px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '8px' }}>Trust layer</div>
          <h2 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.8px', fontFamily: 'Outfit, sans-serif' }}>Built for reliable customer answers</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {TRUST_POINTS.map((item) => (
            <div key={item.title} className="card" style={{ borderColor: '#2a2d38', padding: '18px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>{item.title}</div>
              <div style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <article className="seo-article" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px' }}>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Why Businesses Need an AI Chatbot Now
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Customer expectations have changed. When someone visits your website or sends a message to your business, they want an answer quickly — not in a few hours, not tomorrow morning. Businesses that rely solely on a human team to handle inbound enquiries miss questions that arrive outside working hours, during busy periods, or when staff are occupied with other work.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            An AI chatbot for business solves this by handling routine customer questions automatically, at any hour. It does not replace your team — it handles the predictable, repetitive enquiries so your team can focus on work that genuinely needs human attention.
          </p>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            What an AI Chatbot for Business Actually Does
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            An AI chatbot for business accepts natural-language questions from customers — typed in whatever way they think of them — and responds with accurate, relevant answers sourced from your business content. It is not a decision tree of buttons and menus. It understands what the customer is asking and finds the right answer from the knowledge you have uploaded.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Questions about product details, pricing, availability, delivery timelines, return policies, service scope — these are the kinds of enquiries a well-configured business chatbot handles without any human involvement. When a question falls outside what the bot knows, it tells the customer and offers to connect them with your team.
          </p>
        </section>

        <section style={{ marginBottom: '52px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Trained on Your Own Business Data
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            The most important quality of a useful business chatbot is accuracy — and accuracy comes from training on your actual content, not generic internet data. Questme.ai trains the AI exclusively on what you provide: your product pages, service descriptions, pricing documents, FAQs, and policies.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            When a customer asks a question, the bot searches your uploaded content for the most relevant answer. It does not guess or improvise. If the answer is in your knowledge base, it delivers it accurately. If not, it says so. This zero-hallucination approach means you can trust what the bot tells your customers.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginTop: '16px' }}>
            You can update your content at any time. Add a new product, change a pricing plan, update a policy — the bot reflects those changes immediately without any retraining process.
          </p>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Works as an AI Chat Support Tool on Your Website
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Your website is often the first place customers look for answers. Adding an AI chat support widget means visitors get immediate help rather than hunting through pages or submitting a contact form and waiting. The chatbot sits in the corner of every page, ready to answer questions the moment a visitor has one.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Embedding the chatbot on your website requires a single script tag — it works on Shopify, WordPress, Webflow, Wix, and any custom-built site. No plugins, no developer work, no complicated setup.
          </p>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            WhatsApp AI Chatbot for Customer Enquiries
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            In Southeast Asia and many other markets, WhatsApp is how customers prefer to contact businesses. A WhatsApp AI chatbot powered by Questme.ai connects to your existing WhatsApp Business number and handles inbound messages using the same knowledge base as your website chatbot. Your customers get immediate answers on the channel they already use.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            One knowledge base, two channels. Whether a customer reaches you via your website or WhatsApp, they get the same accurate, consistent responses. Learn more on our dedicated{' '}
            <Link href="/whatsapp-ai-chatbot-for-business" style={{ color: '#AAFF00', textDecoration: 'none' }}>WhatsApp AI chatbot for business</Link> page.
          </p>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            An AI Enquiry Response System That Runs 24/7
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            As an automated customer support system, Questme.ai operates continuously. There are no shift changes, no after-hours gaps, and no delays caused by busy periods. A customer who sends a question at midnight on a Sunday gets the same quality of response as one who contacts you on a Tuesday afternoon.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            This AI enquiry response system also captures lead information alongside each chat session. Every conversation becomes an opportunity to collect a name and email address — building your prospect list automatically while providing genuine value to each visitor.
          </p>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Works for Any Business Size — Including Small Business
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Enterprise tools come with enterprise price tags and enterprise complexity. Questme.ai is priced and designed for businesses of all sizes. A chatbot for small business needs to be affordable, easy to manage, and effective without requiring a dedicated team to maintain it. Questme.ai meets all three criteria.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Setup takes under 10 minutes. There is a free plan to get started, and paid plans scale with your usage. See also our guide specifically for{' '}
            <Link href="/ai-chatbot-for-small-business" style={{ color: '#AAFF00', textDecoration: 'none' }}>AI chatbots for small business</Link>.
          </p>
        </section>

        <section style={{ marginBottom: '52px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.4px', fontFamily: 'Outfit, sans-serif', marginBottom: '14px' }}>
            Commercial outcomes teams care about
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
            {OUTCOMES.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: '#D1D5DB' }}>
                <span style={{ color: '#AAFF00', fontWeight: 900, lineHeight: 1 }}>✓</span>
                <span style={{ lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Related pages */}
        <section style={{ marginBottom: '52px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '12px', padding: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#AAFF00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Related guides</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              ['AI Customer Support Chatbot', '/ai-customer-support-chatbot'],
              ['AI Product Knowledge Chatbot', '/ai-product-knowledge-chatbot'],
              ['WhatsApp AI Chatbot for Business', '/whatsapp-ai-chatbot-for-business'],
              ['AI Chatbot for Small Business', '/ai-chatbot-for-small-business'],
            ].map(([label, href]) => (
              <Link key={href} href={href} style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#AAFF00', fontSize: '12px' }}>→</span>{label}
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '32px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '10px', color: '#F0F0F0' }}>
                What is an AI chatbot for business?
              </h3>
              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.8 }}>
                An AI chatbot for business is a software tool that automatically answers customer questions using artificial intelligence. Unlike scripted bots with pre-set menus, an AI chatbot understands natural-language questions and responds from a knowledge base — in this case, your own product and service content. It operates on your website, WhatsApp, or other channels without requiring human involvement for routine enquiries.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #1E2028', paddingTop: '28px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '10px', color: '#F0F0F0' }}>
                How is a WhatsApp AI chatbot different from a website chatbot?
              </h3>
              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.8 }}>
                Both use the same AI and the same knowledge base — the difference is the channel. A website chatbot appears as a widget on your web pages. A WhatsApp AI chatbot connects to your WhatsApp Business number and handles messages sent there. With Questme.ai, one knowledge base powers both, so your customers get consistent answers regardless of how they reach you.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #1E2028', paddingTop: '28px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '10px', color: '#F0F0F0' }}>
                What is an automated customer support system?
              </h3>
              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.8 }}>
                An automated customer support system handles inbound customer questions without requiring a human to respond to each one individually. Questme.ai is an AI-powered version of this: it reads each incoming question, searches your business knowledge base for the most relevant answer, and responds immediately. Complex or sensitive enquiries can be escalated to your team automatically.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #1E2028', paddingTop: '28px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '10px', color: '#F0F0F0' }}>
                Can an AI chatbot for business replace human support entirely?
              </h3>
              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.8 }}>
                Not entirely — and it should not try to. AI chatbots handle routine, answerable questions well: product details, pricing, policies, how-to questions. Complex situations, complaints, or conversations that require judgment and empathy are better handled by a human. The most effective approach is a hybrid model where AI handles volume and availability, and your team handles the cases that genuinely benefit from human attention.
              </p>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Launch business AI answers<br /><span style={{ color: '#AAFF00' }}>in minutes</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px' }}>
            Train once on your knowledge base, deploy across channels, and respond to customer questions around the clock.
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
