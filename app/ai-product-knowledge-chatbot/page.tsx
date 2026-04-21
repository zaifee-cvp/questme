import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Product Knowledge Chatbot | Questme.ai',
  description: 'Train an AI chatbot on your product catalogue, FAQs, and service details. Questme.ai answers customer product questions instantly and accurately.',
  alternates: { canonical: 'https://questme.ai/ai-product-knowledge-chatbot' },
}

export default function AIProductKnowledgeChatbot() {
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
          AI Answers Trained on Your Business
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1.5px', fontFamily: 'Outfit, sans-serif' }}>
          Replace generic chatbot replies<br />
          <span style={{ color: '#AAFF00' }}>with accurate product answers</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px', maxWidth: '620px' }}>
          Train Questme on your catalogue, FAQs, and policies so visitors get fast, reliable answers from your own knowledge, not internet guesswork.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['Built for product and service websites', 'Grounded in your own content', 'Designed to reduce repetitive support'].map((pill) => (
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
            The Problem with Generic Chatbots
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Most chatbots are built around templates and scripted flows. A customer asks a question, the bot offers a menu of buttons, and they click through a decision tree until they either find something useful or give up. This approach frustrates customers because it rarely matches how people actually ask questions.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Worse, generic AI chatbots trained on the open internet will confidently give answers that have nothing to do with your specific products, pricing, or policies. That erodes trust fast. A customer who gets a wrong answer from your chatbot loses confidence in your business — not in the chatbot.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            What a Product Knowledge Chatbot Does Differently
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            A product knowledge chatbot is built on your content — not the internet. It only knows what you've told it, which means it can only answer from the information you've provided. This is actually a feature, not a limitation. Your customers get precise answers drawn from your product documentation, your pricing pages, your return policies, and your service terms.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            When someone asks "what sizes does this come in?" or "how long does delivery take?" or "is this product compatible with X?" — the bot pulls the answer directly from your uploaded content and responds in seconds. No hallucinations. No irrelevant information. Just accurate, helpful answers that reflect your business.
          </p>
        </section>

        <section style={{ marginBottom: '56px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Upload Your Product Info — The AI Learns It
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '24px' }}>
            Getting started with Questme.ai requires no technical knowledge. You give the AI your content in whatever format you already have it:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { icon: '🔗', label: 'Product page URLs', desc: 'Paste links and we crawl them automatically' },
              { icon: '📄', label: 'PDF documents', desc: 'Upload catalogues, spec sheets, manuals' },
              { icon: '📝', label: 'FAQ text', desc: 'Type or paste your most common Q&As' },
              { icon: '📋', label: 'Plain text', desc: 'Copy-paste any content directly' },
            ].map(item => (
              <div key={item.label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            The AI processes and indexes your content within seconds. You can update it any time — add new products, edit pricing, update policies — and the bot reflects those changes immediately.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Accurate, On-Brand Answers Every Time
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            One of the biggest concerns business owners have about AI is accuracy. What if it says the wrong thing? Questme.ai addresses this directly: if the answer isn't in your knowledge base, the bot says it doesn't know and offers to connect the customer with your team. It will never fabricate an answer.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            This zero-hallucination approach means you can trust what the bot tells your customers. You also get a knowledge gap dashboard — a view of which questions customers are asking that the bot couldn't answer, so you can fill those gaps over time and keep improving the experience.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Works Across Website, WhatsApp, and More
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Your product knowledge chatbot isn't limited to one channel. Embed it on your website with a single script tag — it works on any platform including Shopify, WordPress, and Webflow. Deploy the same bot on WhatsApp to reach customers where they already spend time.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            One knowledge base. Multiple channels. Consistent answers everywhere.
          </p>
        </section>

        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Built for Businesses That Sell Products or Services
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '16px' }}>
            Whether you run an e-commerce store, a service-based business, a SaaS product, or a physical retail operation, Questme.ai fits. Any business that regularly fields the same customer questions can benefit from an AI that handles them automatically.
          </p>
          <p style={{ fontSize: '16px', color: '#9CA3AF', lineHeight: 1.8 }}>
            Your team gets back the time they were spending on repetitive support. Customers get answers instantly instead of waiting. And you get a system that scales with your business — whether you're handling 10 enquiries a day or 10,000.
          </p>
        </section>

        {/* CTA */}
        <section style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '20px', padding: '48px 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Turn product questions into faster decisions<br /><span style={{ color: '#AAFF00' }}>with Questme</span>
          </h2>
          <p style={{ fontSize: '16px', color: '#9CA3AF', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
            Launch your knowledge bot quickly and keep visitors moving toward purchase with instant, grounded answers.
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
