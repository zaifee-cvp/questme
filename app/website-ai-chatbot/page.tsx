import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Website AI Chatbot for Businesses | Questme.ai',
  description: 'Add a website AI chatbot to your business site with Questme.ai. Answer visitor questions instantly, reduce support load, and capture leads — trained on your own content.',
  alternates: { canonical: 'https://questme.ai/website-ai-chatbot' },
}

const TRUST_POINTS = [
  {
    title: 'Grounded in your own content',
    desc: 'Answers come from your uploaded pages, docs, and FAQs.',
  },
  {
    title: 'No forced guesswork',
    desc: 'When an answer is unavailable in your knowledge base, the bot can be transparent.',
  },
  {
    title: 'Conversion-friendly handoff',
    desc: 'Escalate high-value conversations to your team when human support is needed.',
  },
  {
    title: 'Quick website launch',
    desc: 'Deploy with a lightweight embed and start supporting visitors in minutes.',
  },
]

const OUTCOMES = [
  'Answer objections before visitors abandon your pages',
  'Reduce repetitive support questions that slow your team',
  'Capture more qualified website leads during live intent',
  'Improve after-hours responsiveness without added staffing',
]

export default function WebsiteAIChatbot() {
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
          AI Website Chat for Conversion
        </div>
        <h1 className="hero-h1" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1.5px', fontFamily: 'Outfit, sans-serif' }}>
          Stop losing website buyers to<br />
          <span style={{ color: '#AAFF00' }}>unanswered questions</span>
        </h1>
        <p className="hero-sub" style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px', maxWidth: '620px' }}>
          Questme turns your website into an always-on response channel that reduces support backlog and captures more high-intent conversations.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['For ecommerce stores', 'For SaaS product sites', 'For service businesses', 'One-line website embed'].map((pill) => (
            <span key={pill} style={{ fontSize: '12px', color: '#D1D5DB', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '999px', padding: '6px 12px' }}>
              {pill}
            </span>
          ))}
        </div>
        <div className="hero-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/sign-up" className="btn-accent" style={{ fontSize: '16px', padding: '14px 32px' }}>Start free trial</Link>
          <Link href="/" className="btn-ghost" style={{ fontSize: '16px', padding: '14px 32px' }}>See platform overview</Link>
        </div>
        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '12px' }}>When answers are delayed, purchase intent cools fast.</p>
      </section>

      <section style={{ maxWidth: '980px', margin: '0 auto', padding: '0 24px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: '#9CA3AF', marginBottom: '8px' }}>Trust layer</div>
          <h2 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.8px', fontFamily: 'Outfit, sans-serif' }}>Built for dependable on-site answers</h2>
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
            Why Your Website Needs an AI Chatbot
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Most website visitors leave without taking action. They browse, encounter a question they cannot easily answer from the page content, and leave. Static pages cannot respond to specific, individual questions — but a website AI chatbot can. It intercepts the moment a visitor gets stuck and gives them the answer they need to keep moving forward.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            The result is longer engagement, fewer unanswered questions, and more visitors converted into leads or customers. Adding an AI chatbot to your website is one of the most direct ways to improve how your site performs for the visitors already coming to it.
          </p>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            What a Website AI Chatbot Does for Visitors
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            A website AI chatbot sits in a floating widget on your pages and accepts questions in natural language. Visitors type whatever they want to know — about products, pricing, availability, policies, how your service works — and the bot responds within seconds using your actual business content as the source.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            This is meaningfully different from a FAQ page. A FAQ page requires visitors to know which category their question fits and hunt through a list. A chatbot accepts the question in whatever form it arrives and finds the relevant answer automatically. The experience is conversational and fast.
          </p>
        </section>

        <section style={{ marginBottom: '52px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Powered by Your Own Business Knowledge
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            A website AI chatbot is only as useful as the knowledge it has. Questme.ai trains the chatbot exclusively on the content you provide — not on generic internet data. You supply your product descriptions, service details, pricing pages, policies, and FAQs. The bot answers from that, and only from that.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            You can add content as URLs to crawl, PDF uploads, typed FAQs, or plain text. The AI indexes everything and makes it searchable in natural language. Update your content any time — new products, revised pricing, updated terms — and the bot reflects the change immediately.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            If the bot cannot find an answer in your knowledge base, it says so honestly rather than generating a plausible-sounding guess. Accuracy matters for customer trust, and Questme.ai is built around that principle.
          </p>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            AI Chat Support That Never Goes Offline
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Your website is accessible at all hours. Your AI chat support should be too. Questme.ai runs continuously — visitors browsing at midnight, on weekends, or on public holidays all get the same quality of response as those visiting during business hours.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            This 24/7 availability is particularly valuable for businesses that serve customers across time zones, operate in markets where customers browse late, or run e-commerce stores where purchase decisions happen at any hour. Offline chat support is a conversion killer — the AI chatbot removes that problem entirely.
          </p>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Works as an AI Enquiry Response System on Every Page
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Because the chatbot widget loads on every page, it functions as a site-wide AI enquiry response system. Whether a visitor is on your homepage, a product page, a pricing page, or a blog post, the same chatbot is available. Questions that arise during browsing get answered where they arise — the visitor does not need to navigate to a contact page or find a help section.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            The chatbot can also capture lead information. Email addresses collected during chat sessions are saved to your dashboard, building a list of prospects who engaged with genuine questions about your business. See our full guide on{' '}
            <Link href="/website-ai-chatbot-for-lead-generation" style={{ color: '#AAFF00', textDecoration: 'none' }}>website AI chatbot for lead generation</Link> for more on this.
          </p>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Easy to Embed on Any Website — No Developer Needed
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Getting your website AI chatbot live requires no technical skills and no developer. After setting up your bot and training it on your content, you receive a single script tag to paste into your website. That is the entire implementation.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginTop: '20px' }}>
            {['Shopify', 'WordPress', 'Webflow', 'Wix', 'Squarespace', 'Custom HTML'].map(platform => (
              <div key={platform} className="card" style={{ textAlign: 'center', padding: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#D1D5DB', fontFamily: 'Outfit, sans-serif' }}>{platform}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '52px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Right for Businesses of All Sizes
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            A website AI chatbot is not exclusively an enterprise product. For a chatbot for small business, the value proposition is especially clear: a small team cannot monitor a website chat inbox at all hours, but an AI system can. Questme.ai pricing starts low enough that the cost is justified by a single additional lead or saved support hour per month — and the benefit compounds over time.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Larger businesses benefit from the scale — the automated customer support system handles high volumes without added staffing costs. Read more about how{' '}
            <Link href="/ai-chatbot-for-business" style={{ color: '#AAFF00', textDecoration: 'none' }}>AI chatbots work for business</Link> generally.
          </p>
        </section>

        <section style={{ marginBottom: '52px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.4px', fontFamily: 'Outfit, sans-serif', marginBottom: '14px' }}>
            Commercial outcomes from faster answers
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
              ['AI Chatbot for Business', '/ai-chatbot-for-business'],
              ['Website AI Chatbot for Lead Generation', '/website-ai-chatbot-for-lead-generation'],
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
                What is a website AI chatbot?
              </h3>
              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.8 }}>
                A website AI chatbot is a software widget that sits on your web pages and answers visitor questions in real time using artificial intelligence. Unlike a traditional live chat widget that requires a human to respond, an AI chatbot responds automatically using a knowledge base — in Questme.ai&apos;s case, the content you have uploaded about your business.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #1E2028', paddingTop: '28px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '10px', color: '#F0F0F0' }}>
                How does a website AI chatbot provide AI chat support?
              </h3>
              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.8 }}>
                When a visitor types a question, the chatbot searches your uploaded business content for the most relevant answer using semantic search — meaning it understands the meaning of the question, not just the keywords. It then generates a natural-language response from that content. This is AI chat support: automated, accurate, and based on your specific business knowledge.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #1E2028', paddingTop: '28px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '10px', color: '#F0F0F0' }}>
                What makes an AI enquiry response system different from a contact form?
              </h3>
              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.8 }}>
                A contact form collects a message and sends it to your inbox for a human to respond to later. An AI enquiry response system answers immediately, without any human involvement, at any time of day. For the majority of routine questions — product details, pricing, policies — the AI provides a better experience than a form because the visitor gets an answer now rather than waiting for a reply.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #1E2028', paddingTop: '28px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '10px', color: '#F0F0F0' }}>
                Is a website AI chatbot suitable for small business?
              </h3>
              <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.8 }}>
                Yes — in fact, small businesses often benefit most. A small team cannot staff a live chat inbox around the clock, but an AI chatbot handles it automatically. Questme.ai is designed and priced to work for small businesses: setup takes minutes, there is no developer required, and plans start at a level that makes the cost easy to justify from the first few additional leads or support hours saved.
              </p>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Add always-on AI answers to your website<br /><span style={{ color: '#AAFF00' }}>today</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px' }}>
            Launch quickly, answer questions in real time, and keep visitors engaged through conversion-critical moments.
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
