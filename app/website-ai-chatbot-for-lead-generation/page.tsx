import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Website AI Chatbot for Lead Generation | Questme.ai',
  description: 'Add an AI chatbot to your website that engages visitors, answers their questions, and captures leads automatically — powered by your own business knowledge.',
  alternates: { canonical: 'https://questme.ai/website-ai-chatbot-for-lead-generation' },
}

const TRUST_POINTS = [
  {
    title: 'Lead capture from active intent',
    desc: 'Collect contact details while visitors are asking real buying questions.',
  },
  {
    title: 'Answers from your business knowledge',
    desc: 'Respond from your own pricing, product, and service information.',
  },
  {
    title: 'Transparent and controllable flows',
    desc: 'Use chatbot behavior that stays aligned with your support and sales process.',
  },
  {
    title: 'Fast setup on any website',
    desc: 'Launch quickly with an embed and start capturing opportunities immediately.',
  },
]

const OUTCOMES = [
  'Convert more anonymous traffic into qualified pipeline',
  'Answer buyer objections before prospects bounce',
  'Capture lead intent 24/7, including after-hours visits',
  'Reduce manual qualification time for your team',
]

export default function WebsiteAIChatbotLeadGeneration() {
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
          Conversational Lead Capture
        </div>
        <h1 className="hero-h1" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1.5px', fontFamily: 'Outfit, sans-serif' }}>
          Stop losing high-intent visitors<br />
          <span style={{ color: '#AAFF00' }}>before they contact your team</span>
        </h1>
        <p className="hero-sub" style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px', maxWidth: '620px' }}>
          Questme turns passive traffic into active conversations by answering questions instantly and capturing lead details at the point of intent.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['For ecommerce stores', 'For SaaS and product websites', 'For service businesses', 'Answer first, capture second'].map((pill) => (
            <span key={pill} style={{ fontSize: '12px', color: '#D1D5DB', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '999px', padding: '6px 12px' }}>
              {pill}
            </span>
          ))}
        </div>
        <div className="hero-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 32px' }}>Start free trial</Link>
          <Link href="/" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 32px' }}>See platform overview</Link>
        </div>
        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '12px' }}>When lead responses are delayed, buying intent disappears quickly.</p>
      </section>

      <section style={{ maxWidth: '980px', margin: '0 auto', padding: '0 24px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '8px' }}>Trust layer</div>
          <h2 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.8px', fontFamily: 'Outfit, sans-serif' }}>Built for conversion-ready conversations</h2>
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

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Most Website Visitors Leave Without Engaging
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            The majority of people who land on a business website leave without filling out a form, making a call, or sending a message. They had questions, browsed around, didn't find quick enough answers, and moved on. For most businesses, this represents a significant amount of lost potential revenue — visitors who were genuinely interested but never got the nudge they needed.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Static content alone doesn't convert well. Pages can't respond to what a specific visitor wants to know. A chatbot can — and it can do it in real time, at the exact moment a visitor is considering whether to reach out.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            How an AI Chatbot Keeps Visitors on Your Site
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            When a visitor lands on your website and the chatbot proactively appears — ready to answer questions — it creates a moment of engagement. The visitor types a question, gets an accurate answer immediately, and the conversation continues. They stay on the page longer. They learn more about your products or services. And crucially, they're more likely to share their contact details when they feel they've already gotten value from the interaction.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            This is fundamentally different from a contact form, which asks for commitment upfront before giving anything in return. The chatbot gives first — useful, relevant answers — and then naturally transitions to lead capture once trust is established.
          </p>
        </section>

        <section style={{ marginBottom: '56px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Answers Questions and Captures Lead Information
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Questme.ai includes a lead capture feature that gates the chat with an email form. You decide when it appears — at the start, after a certain number of messages, or before accessing specific information. Every chat session becomes an opportunity to collect a name and email address, giving you a qualified list of people who are actively interested in what you offer.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            The lead information is stored in your dashboard, giving you a growing list of prospects to follow up with. Unlike ad-generated leads who may have minimal intent, these are people who came to your website and showed enough interest to ask specific questions about your products or services.
          </p>
          <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#F0F0F0', marginBottom: '10px', marginTop: '8px' }}>
            What makes these leads higher quality?
          </h3>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            They've self-qualified. By asking specific questions about your products, pricing, or services, they've demonstrated genuine interest. Your follow-up conversations start warmer because the lead already knows something about what you offer.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Trained on Your Products, Pricing, and Services
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            A chatbot is only as good as the knowledge it has. Questme.ai is trained on your actual content — your product pages, pricing documents, service descriptions, and FAQs. It doesn't give generic answers. It gives your answers.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            You can upload URLs, PDFs, FAQ documents, or plain text. The AI indexes everything and makes it searchable in natural language. When a visitor asks "what's included in the Pro plan?" or "do you offer discounts for annual billing?" — the bot pulls the right answer from your knowledge base. No scripting, no decision trees to maintain.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Works While You Sleep — No Human Needed
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Website visitors come at all hours. A visitor in a different time zone might be browsing your site at 3am your time. Without automation, that's a lead you'll never capture. With Questme.ai, the chatbot is active 24/7 — engaging visitors, answering questions, and collecting contact details whether you're at your desk or not.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            When you check your dashboard the next morning, you'll see the conversations that happened overnight and the leads that were captured while you slept. Your website goes from a passive brochure to an active sales tool.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Easy to Embed on Any Website
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Adding the Questme.ai chatbot to your website requires no coding knowledge. Once you've set up your bot and trained it on your content, you get a single script tag to paste into your website's HTML. It works on any platform — Shopify, WordPress, Webflow, Squarespace, Wix, or a custom-built site.
          </p>
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {['Shopify', 'WordPress', 'Webflow', 'Wix', 'Squarespace', 'Custom HTML'].map(platform => (
              <div key={platform} className="card" style={{ textAlign: 'center', padding: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#D1D5DB', fontFamily: 'Outfit, sans-serif' }}>{platform}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '56px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.4px', fontFamily: 'Outfit, sans-serif', marginBottom: '14px' }}>
            Commercial outcomes from better lead response
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

        {/* CTA */}
        <section style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Turn website traffic into conversations<br /><span style={{ color: '#AAFF00' }}>that convert</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
            Engage visitors instantly, answer their key questions, and capture stronger lead intent automatically.
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
          <Link href="/automated-customer-enquiry-system" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Automated Enquiry System</Link>
        </div>
      </footer>

    </div>
  )
}
