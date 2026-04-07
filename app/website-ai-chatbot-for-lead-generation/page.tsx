import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Website AI Chatbot for Lead Generation | Questme.ai',
  description: 'Add an AI chatbot to your website that engages visitors, answers their questions, and captures leads automatically — powered by your own business knowledge.',
  alternates: { canonical: 'https://questme.ai/website-ai-chatbot-for-lead-generation' },
}

export default function WebsiteAIChatbotLeadGeneration() {
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
          Lead Generation Automation
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1.5px', fontFamily: 'Outfit, sans-serif' }}>
          Website AI Chatbot for<br />
          <span style={{ color: '#AAFF00' }}>Lead Generation</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px', maxWidth: '620px' }}>
          Most website visitors leave without ever reaching out. An AI chatbot trained on your business knowledge engages them, answers their questions, and captures contact information — turning passive visitors into qualified leads.
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

        {/* CTA */}
        <section style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Start Capturing More Leads<br /><span style={{ color: '#AAFF00' }}>With AI Today</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
            Turn your website visitors into qualified leads — automatically. Set up in minutes, no developer required.
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
          <Link href="/automated-customer-enquiry-system" style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'none' }}>Automated Enquiry System</Link>
        </div>
      </footer>

    </div>
  )
}
