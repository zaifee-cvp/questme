import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Embeddable AI Chat Widget',
  description: 'Add an AI chat widget to any website in 5 minutes with one line of code. Works on Shopify, WordPress, Webflow, and any HTML site.',
  openGraph: {
    title: 'Embeddable AI Chat Widget | Questme.ai',
    description: 'Add an AI chat widget to any website in 5 minutes with one line of code.',
    url: 'https://www.questme.ai/features/embeddable-ai-chat-widget',
    type: 'website',
  },
}

const faqs = [
  { q: 'Will the widget slow down my website?', a: 'No. The script loads asynchronously and doesn\'t block your page. It has no measurable impact on Core Web Vitals or page load time.' },
  { q: 'Which website platforms does it work on?', a: 'Any platform that allows you to add a script tag: Shopify, WordPress, Webflow, Squarespace, Wix, Framer, custom HTML, React, Next.js, and more.' },
  { q: 'Can I customise the widget\'s appearance?', a: 'Yes — you can set the accent colour, welcome message, and bot name. The widget adapts to your brand rather than imposing a generic look.' },
  { q: 'Can I embed the same bot on multiple pages or domains?', a: 'Yes. The same embed code works across any number of pages and domains with no restrictions.' },
  { q: 'What if I don\'t have a website yet?', a: 'You also get a shareable link — a direct chat page you can share via email, WhatsApp, or social media. No website required.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Embeddable AI Chat Widget | Questme.ai',
  description: 'Add an AI chat widget to any website in 5 minutes with one line of code.',
  url: 'https://www.questme.ai/features/embeddable-ai-chat-widget',
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
}

export default function EmbeddableAIChatWidgetPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 32px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 80px' }}>
          <div style={{ display: 'inline-block', background: '#AAFF0015', border: '1px solid #AAFF0030', borderRadius: '100px', padding: '6px 16px', fontSize: '12px', color: '#AAFF00', fontWeight: 600, marginBottom: '24px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Embeddable AI Chat Widget
          </div>
          <h1 style={{ fontSize: '54px', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}>
            Add an AI Chat Widget to <span style={{ color: '#AAFF00' }}>Any Website in 5 Minutes</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px' }}>
            One line of code. Works on Shopify, WordPress, Webflow, and any HTML site. Your AI is live before your coffee finishes brewing.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/sign-up" style={{ display: 'inline-block', background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '16px', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
              Start Free Today →
            </Link>
            <Link href="/blog/embed-ai-chat-on-website" style={{ display: 'inline-block', background: 'none', color: '#F0F0F0', fontWeight: 600, fontSize: '15px', padding: '16px 28px', borderRadius: '10px', textDecoration: 'none', border: '1px solid #2D3148' }}>
              Step-by-Step Guide
            </Link>
          </div>
        </div>

        {/* Embed code preview */}
        <div style={{ maxWidth: '640px', margin: '0 auto 80px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #1E2028', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f87171' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80' }} />
            <span style={{ marginLeft: '8px', fontSize: '12px', color: '#4B5563' }}>Your website HTML</span>
          </div>
          <div style={{ padding: '24px', fontFamily: 'monospace', fontSize: '14px', lineHeight: 1.8 }}>
            <span style={{ color: '#6B7280' }}>&lt;!-- Paste before &lt;/body&gt; --&gt;</span><br />
            <span style={{ color: '#AAFF00' }}>&lt;script</span>
            <span style={{ color: '#60A5FA' }}> src</span>
            <span style={{ color: '#F0F0F0' }}>=</span>
            <span style={{ color: '#34D399' }}>&quot;https://www.questme.ai/widget.js&quot;</span><br />
            <span style={{ color: '#60A5FA' }}>{'        '}data-bot-id</span>
            <span style={{ color: '#F0F0F0' }}>=</span>
            <span style={{ color: '#34D399' }}>&quot;your-bot-id&quot;</span>
            <span style={{ color: '#AAFF00' }}>&gt;&lt;/script&gt;</span>
          </div>
        </div>

        {/* Platform compatibility */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>Works on Every Platform</h2>
          <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '16px', marginBottom: '40px' }}>If your website can add a script tag, you can embed Questme.ai.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
            {['Shopify', 'WordPress', 'Webflow', 'Squarespace', 'Wix', 'Framer', 'React / Next.js', 'Custom HTML', 'Vue / Nuxt', 'Any platform'].map(platform => (
              <div key={platform} style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '10px', padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 500, color: '#D1D5DB' }}>
                {platform}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '48px', fontFamily: 'Outfit, sans-serif' }}>Widget Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { icon: '🎨', title: 'Brand Customisation', desc: 'Set your accent colour, bot name, and welcome message. The widget looks like it belongs on your site.' },
              { icon: '⚡', title: 'Zero Performance Impact', desc: 'Loads asynchronously. Doesn\'t affect your Lighthouse score, LCP, or Core Web Vitals in any measurable way.' },
              { icon: '📱', title: 'Mobile Optimised', desc: 'The widget is fully responsive and works beautifully on all screen sizes — desktop, tablet, and mobile.' },
              { icon: '🔗', title: 'Shareable Link Too', desc: 'No website? No problem. Share a direct link to your AI chat page via email, WhatsApp, or social media.' },
              { icon: '🌐', title: 'Multi-Page Deployment', desc: 'Place the widget on every page of your site — product pages, checkout, contact page — with the same single snippet.' },
              { icon: '📊', title: 'Usage Analytics', desc: 'Track conversations, question volume, and engagement from your dashboard. See exactly how customers are using it.' },
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
            Your AI widget is 5 minutes from live
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            Create your bot, upload your knowledge, copy one line of code. That&apos;s it.
          </p>
          <Link href="/sign-up" style={{ display: 'inline-block', background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '16px', padding: '16px 40px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
            Get Started Free →
          </Link>
        </div>
      </div>
    </>
  )
}
