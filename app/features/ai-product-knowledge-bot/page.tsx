import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Product Knowledge Bot',
  description: 'Turn your product docs, FAQs, and URLs into a 24/7 AI assistant that answers every customer question instantly and accurately. No coding required.',
  openGraph: {
    title: 'AI Product Knowledge Bot | Questme.ai',
    description: 'Turn your product docs, FAQs, and URLs into a 24/7 AI assistant.',
    url: 'https://www.questme.ai/features/ai-product-knowledge-bot',
    type: 'website',
  },
}

const faqs = [
  { q: 'What content can I upload to train the bot?', a: 'PDFs, website URLs, plain text, FAQ question-answer pairs, and images with descriptions. The bot learns from all of it.' },
  { q: 'How long does it take to set up?', a: 'Most businesses have a working bot in under 30 minutes. Upload your content, embed one line of code, and you\'re live.' },
  { q: 'Will the bot give wrong answers?', a: 'The bot answers from your uploaded content only, so it can\'t fabricate information. If a question isn\'t covered, it says so and can direct customers to your team.' },
  { q: 'Can I update the knowledge base after launch?', a: 'Yes. Add, edit, or remove sources any time from your dashboard. Changes are reflected in the bot immediately.' },
  { q: 'Does it work for large product catalogues?', a: 'Yes. You can upload entire catalogues as PDFs or crawl multiple product pages. The bot searches the full knowledge base for each question.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'AI Product Knowledge Bot | Questme.ai',
  description: 'Turn your product docs, FAQs, and URLs into a 24/7 AI assistant that answers every customer question instantly and accurately.',
  url: 'https://www.questme.ai/features/ai-product-knowledge-bot',
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
}

export default function AIProductKnowledgeBotPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 32px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 80px' }}>
          <div style={{ display: 'inline-block', background: '#AAFF0015', border: '1px solid #AAFF0030', borderRadius: '100px', padding: '6px 16px', fontSize: '12px', color: '#AAFF00', fontWeight: 600, marginBottom: '24px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            AI Product Knowledge Bot
          </div>
          <h1 style={{ fontSize: '54px', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}>
            Turn Your Product Docs Into a <span style={{ color: '#AAFF00' }}>24/7 AI Assistant</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px' }}>
            Upload your PDFs, FAQs, and product URLs. Get an AI bot that answers every customer question accurately — the moment they ask it, any time of day.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/sign-up" style={{ display: 'inline-block', background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '16px', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
              Start Free Today →
            </Link>
            <Link href="/blog/what-is-a-product-knowledge-bot" style={{ display: 'inline-block', background: 'none', color: '#F0F0F0', fontWeight: 600, fontSize: '15px', padding: '16px 28px', borderRadius: '10px', textDecoration: 'none', border: '1px solid #2D3148' }}>
              Learn More
            </Link>
          </div>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '48px', fontFamily: 'Outfit, sans-serif' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { step: '01', title: 'Upload Your Knowledge', desc: 'Add PDFs, crawl URLs, paste text, or enter FAQ pairs. Any format, any volume.' },
              { step: '02', title: 'AI Indexes Everything', desc: 'The system chunks and vectorises your content for instant, accurate retrieval.' },
              { step: '03', title: 'Embed One Line of Code', desc: 'Copy a single script tag and paste it into your website — live in seconds.' },
              { step: '04', title: 'Customers Get Answers', desc: '24/7, instant, accurate answers from your actual product documentation.' },
            ].map(item => (
              <div key={item.step} style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '14px', padding: '28px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#AAFF00', marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>{item.step}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '48px', fontFamily: 'Outfit, sans-serif' }}>Everything You Need</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { icon: '📄', title: 'Multi-Format Knowledge Sources', desc: 'Upload PDFs, crawl website URLs, paste text snippets, add FAQ pairs, and include images with AI-readable descriptions. Your bot learns from all of it.' },
              { icon: '⚡', title: 'Instant, Accurate Answers', desc: 'Retrieval-Augmented Generation (RAG) ensures every answer comes directly from your content — no hallucinations, no going off-script.' },
              { icon: '🌐', title: 'Embeddable on Any Website', desc: 'One line of code. Works on Shopify, WordPress, Webflow, custom HTML, or any other platform. No developer needed.' },
              { icon: '📊', title: 'Conversation Analytics', desc: 'See every question customers ask, how the bot responded, and where knowledge gaps exist. Continuously improve your coverage.' },
              { icon: '🎯', title: 'Lead Capture Built In', desc: 'Optionally capture customer emails before the conversation starts. Turn every engaged visitor into a qualified lead.' },
              { icon: '🔁', title: 'Human Handoff', desc: 'When a question is outside the bot\'s knowledge, notify your team by email so no customer falls through the cracks.' },
            ].map(f => (
              <div key={f.title} style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '14px', padding: '28px' }}>
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: '720px', margin: '0 auto 80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '48px', fontFamily: 'Outfit, sans-serif' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map(faq => (
              <div key={faq.q} style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px', fontFamily: 'Outfit, sans-serif', color: '#F0F0F0' }}>{faq.q}</h3>
                <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #AAFF0010, #0F1117)', border: '1px solid #AAFF0030', borderRadius: '20px', padding: '64px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>
            Your product knowledge bot is 30 minutes away
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            No credit card required. Free plan available. Upload your first knowledge source in minutes.
          </p>
          <Link href="/sign-up" style={{ display: 'inline-block', background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '16px', padding: '16px 40px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
            Create Your Free Bot →
          </Link>
        </div>
      </div>
    </>
  )
}
