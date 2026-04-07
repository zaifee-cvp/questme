import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Customer Support Automation with AI',
  description: 'Automate up to 60% of customer support with an AI that answers from your own documentation. Free your team for high-value work.',
  openGraph: {
    title: 'Customer Support Automation with AI | Questme.ai',
    description: 'Automate up to 60% of customer support with AI trained on your documentation.',
    url: 'https://www.questme.ai/features/customer-support-automation',
    type: 'website',
  },
}

const faqs = [
  { q: 'What percentage of questions can AI handle automatically?', a: 'Typically 50–70% of inbound support questions are information requests that AI can answer from your documentation. Complex cases, complaints, and disputes still go to your team.' },
  { q: 'Will customers know they\'re talking to a bot?', a: 'The bot is an AI assistant, not an impersonator. Most customers are happy with instant accurate answers regardless of whether a human or AI provided them.' },
  { q: 'Can the bot escalate to a human agent?', a: 'Yes. Configure human handoff to notify your team by email when the bot can\'t answer. Customers are never left without a path forward.' },
  { q: 'How do I know what questions the bot is handling?', a: 'Your dashboard shows every conversation, question, and response. You can review anything the bot struggled with and add knowledge to improve it.' },
  { q: 'How long until I see a reduction in tickets?', a: 'Most businesses see meaningful deflection within the first week of deployment, as soon as the bot is live on high-traffic pages.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Customer Support Automation with AI | Questme.ai',
  description: 'Automate up to 60% of customer support with an AI that answers from your own documentation.',
  url: 'https://www.questme.ai/features/customer-support-automation',
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
}

export default function CustomerSupportAutomationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 32px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 80px' }}>
          <div style={{ display: 'inline-block', background: '#AAFF0015', border: '1px solid #AAFF0030', borderRadius: '100px', padding: '6px 16px', fontSize: '12px', color: '#AAFF00', fontWeight: 600, marginBottom: '24px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Customer Support Automation
          </div>
          <h1 style={{ fontSize: '54px', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}>
            Stop Answering the Same Questions — <span style={{ color: '#AAFF00' }}>Let AI Handle It</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px' }}>
            60% of your support tickets are information requests that AI can answer perfectly from your documentation. Deflect them automatically. Let your team focus on the 40% that actually needs them.
          </p>
          <Link href="/sign-up" style={{ display: 'inline-block', background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '16px', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
            Start Automating Free →
          </Link>
        </div>

        {/* Cost of tickets */}
        <div style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px', padding: '48px', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px', fontFamily: 'Outfit, sans-serif', textAlign: 'center' }}>The Real Cost of Repetitive Support Tickets</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
            {[
              { stat: '$5–25', label: 'cost per ticket to resolve', sub: 'including agent time and tooling' },
              { stat: '60%+', label: 'of tickets are information requests', sub: 'answerable from your documentation' },
              { stat: '24h', label: 'average email support wait time', sub: 'vs. instant with AI' },
              { stat: '40%', label: 'of customers abandon after waiting', sub: 'for a question answer during checkout' },
            ].map(item => (
              <div key={item.stat}>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#AAFF00', fontFamily: 'Outfit, sans-serif', marginBottom: '6px' }}>{item.stat}</div>
                <div style={{ fontSize: '14px', color: '#D1D5DB', fontWeight: 600, marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it deflects */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '48px', fontFamily: 'Outfit, sans-serif' }}>How Ticket Deflection Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              { step: '01', icon: '💬', title: 'Customer Has a Question', desc: 'Instead of sending an email or waiting in a queue, the customer types their question into the AI chat widget on your site.' },
              { step: '02', icon: '🔍', title: 'AI Searches Your Knowledge', desc: 'The bot retrieves the most relevant content from your uploaded docs, policies, and FAQs in milliseconds.' },
              { step: '03', icon: '✅', title: 'Instant Accurate Answer', desc: 'The customer receives a clear, accurate answer sourced from your actual documentation — no waiting, no ticket.' },
              { step: '04', icon: '📬', title: 'Complex Cases Escalate', desc: 'Questions the bot can\'t answer trigger a notification to your team so no customer falls through the cracks.' },
            ].map(item => (
              <div key={item.step} style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '14px', padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#AAFF00', fontFamily: 'Outfit, sans-serif' }}>{item.step}</span>
                  <span style={{ fontSize: '22px' }}>{item.icon}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Questions it handles */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '48px', fontFamily: 'Outfit, sans-serif' }}>Questions Your AI Handles Automatically</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {[
              'Product specifications and dimensions',
              'Shipping timelines and delivery estimates',
              'Return, refund, and exchange policies',
              'Compatibility and technical requirements',
              'Installation and setup instructions',
              'Pricing and bulk order questions',
              'Warranty and guarantee coverage',
              'Size guides and material information',
              'Feature comparisons between products',
              'Order tracking and fulfilment status',
              'Payment methods and terms',
              'Contact details and business hours',
            ].map(item => (
              <div key={item} style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#D1D5DB' }}>
                <span style={{ color: '#AAFF00', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>✓</span>
                {item}
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
            Reduce support tickets by 60% this week
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            Upload your documentation, embed the widget, and let AI handle the repetitive questions starting today.
          </p>
          <Link href="/sign-up" style={{ display: 'inline-block', background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '16px', padding: '16px 40px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
            Start Free Today →
          </Link>
        </div>
      </div>
    </>
  )
}
