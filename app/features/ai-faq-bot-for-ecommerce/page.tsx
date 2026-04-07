import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI FAQ Bot for E-commerce',
  description: 'Replace your static FAQ page with an AI that answers shoppers\' product questions instantly. Reduce cart abandonment and support tickets at the same time.',
  openGraph: {
    title: 'AI FAQ Bot for E-commerce | Questme.ai',
    description: 'Replace your static FAQ page with an AI that answers product questions instantly.',
    url: 'https://www.questme.ai/features/ai-faq-bot-for-ecommerce',
    type: 'website',
  },
}

const faqs = [
  { q: 'Can the bot answer questions about specific product variants?', a: 'Yes. If your knowledge base includes variant-specific information — different sizes, colours, or models — the bot distinguishes between them and answers accurately.' },
  { q: 'What happens when a shopper asks something the bot can\'t answer?', a: 'You configure a fallback message — for example, directing them to email support. You can also enable human handoff to notify your team.' },
  { q: 'Does it work on product pages specifically?', a: 'Yes. You embed the widget directly on any page — product detail pages, category pages, checkout, or your FAQ page itself.' },
  { q: 'Can it capture leads from shoppers who don\'t buy immediately?', a: 'Yes. Questme.ai supports email capture at the start of each conversation, turning engaged product inquirers into leads.' },
  { q: 'How quickly can I get it live for my store?', a: 'Most e-commerce stores go live in under an hour — upload your product data and policies, copy the embed code, done.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'AI FAQ Bot for E-commerce | Questme.ai',
  description: 'Replace your static FAQ page with an AI that answers shoppers\' product questions instantly.',
  url: 'https://www.questme.ai/features/ai-faq-bot-for-ecommerce',
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
}

export default function AIFaqBotForEcommercePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 32px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 80px' }}>
          <div style={{ display: 'inline-block', background: '#AAFF0015', border: '1px solid #AAFF0030', borderRadius: '100px', padding: '6px 16px', fontSize: '12px', color: '#AAFF00', fontWeight: 600, marginBottom: '24px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            AI FAQ Bot for E-commerce
          </div>
          <h1 style={{ fontSize: '54px', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}>
            Let AI Answer Your Product Questions — <span style={{ color: '#AAFF00' }}>Before Customers Give Up</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px' }}>
            Static FAQ pages lose sales. An AI that answers specific product questions instantly — in the shopper&apos;s own words, on the product page — converts them instead.
          </p>
          <Link href="/sign-up" style={{ display: 'inline-block', background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '16px', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
            Start Free Today →
          </Link>
        </div>

        {/* Problem vs Solution */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '80px', maxWidth: '840px', margin: '0 auto 80px' }}>
          <div style={{ background: '#1a0a0a', border: '1px solid #3d1515', borderRadius: '14px', padding: '28px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f87171', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>❌ Static FAQ Page</div>
            {['Shoppers must search manually', 'Doesn\'t cover specific product variants', 'Goes out of date fast', 'Can\'t answer freeform questions', 'No engagement — customers bounce'].map(item => (
              <div key={item} style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '10px', display: 'flex', gap: '8px' }}>
                <span style={{ color: '#f87171', flexShrink: 0 }}>✗</span>{item}
              </div>
            ))}
          </div>
          <div style={{ background: '#0a1a0a', border: '1px solid #1a3d15', borderRadius: '14px', padding: '28px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#AAFF00', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>✓ Questme.ai AI FAQ</div>
            {['Answers any question instantly', 'Knows every product variant', 'Updates in real time', 'Handles natural language questions', 'Captures leads and drives conversions'].map(item => (
              <div key={item} style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '10px', display: 'flex', gap: '8px' }}>
                <span style={{ color: '#AAFF00', flexShrink: 0 }}>✓</span>{item}
              </div>
            ))}
          </div>
        </div>

        {/* Use cases */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>Built for E-commerce Questions</h2>
          <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '16px', marginBottom: '48px', maxWidth: '560px', margin: '0 auto 48px' }}>
            Your AI handles every category of pre- and post-purchase question.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { category: 'Pre-Purchase', questions: ['"Does this fit a king-size bed?"', '"What material is it made from?"', '"Is this compatible with my device?"', '"Does it come in other colours?"'] },
              { category: 'Shipping & Delivery', questions: ['"How long does delivery take?"', '"Do you ship to New Zealand?"', '"What\'s the express option?"', '"How do I track my order?"'] },
              { category: 'Returns & Policies', questions: ['"What\'s the return window?"', '"Do you offer exchanges?"', '"Is there a warranty?"', '"How do refunds work?"'] },
              { category: 'Post-Purchase', questions: ['"How do I set this up?"', '"The item arrived damaged."', '"Can I cancel my order?"', '"Where\'s my tracking number?"'] },
            ].map(section => (
              <div key={section.category} style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '14px', padding: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#AAFF00', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>{section.category}</div>
                {section.questions.map(q => (
                  <div key={q} style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px', fontStyle: 'italic' }}>{q}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Impact stats */}
        <div style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px', padding: '48px', marginBottom: '80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
          {[
            { stat: '60%', label: 'fewer support tickets after deployment' },
            { stat: '3–5×', label: 'higher conversion for chat-engaged visitors' },
            { stat: '<2s', label: 'average response time vs. hours for email' },
            { stat: '24/7', label: 'availability including nights and weekends' },
          ].map(item => (
            <div key={item.stat}>
              <div style={{ fontSize: '40px', fontWeight: 900, color: '#AAFF00', fontFamily: 'Outfit, sans-serif', marginBottom: '8px' }}>{item.stat}</div>
              <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.5 }}>{item.label}</div>
            </div>
          ))}
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
            Stop losing sales to unanswered questions
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            Every unanswered product question is a potential lost sale. Questme.ai fixes that.
          </p>
          <Link href="/sign-up" style={{ display: 'inline-block', background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '16px', padding: '16px 40px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
            Create Your Free Bot →
          </Link>
        </div>
      </div>
    </>
  )
}
