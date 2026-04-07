import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AI Assistant for Product Catalogues',
  description: 'Make your entire product catalogue searchable by AI. Customers ask any question about any product and get an instant, accurate answer.',
  openGraph: {
    title: 'AI Assistant for Product Catalogues | Questme.ai',
    description: 'Make your entire product catalogue searchable by AI.',
    url: 'https://questme.ai/features/product-catalog-ai-assistant',
    type: 'website',
  },
}

const faqs = [
  { q: 'How large a catalogue can the AI handle?', a: 'Questme.ai handles catalogues of all sizes. You can upload multiple PDFs, crawl many URLs, and organise sources into folders. The AI searches the full knowledge base for every question.' },
  { q: 'Can customers compare products through the chat?', a: 'Yes. If a customer asks "what\'s the difference between model A and model B?", the bot retrieves specs for both and provides a comparison.' },
  { q: 'What file formats are supported for catalogue uploads?', a: 'PDF is the primary format for catalogue documents. You can also crawl product pages via URL, paste text content, and add FAQ pairs for common catalogue questions.' },
  { q: 'Can I organise my knowledge base by product category?', a: 'Yes. Questme.ai supports folders in the knowledge base, so you can organise sources by product line, category, or any structure that works for you.' },
  { q: 'Does it work for B2B product catalogues?', a: 'Absolutely. B2B products often have more complex specs and technical requirements — exactly the kind of detailed questions an AI knowledge bot excels at answering.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'AI Assistant for Product Catalogues | Questme.ai',
  description: 'Make your entire product catalogue searchable by AI.',
  url: 'https://questme.ai/features/product-catalog-ai-assistant',
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
}

export default function ProductCatalogAIAssistantPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 32px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 80px' }}>
          <div style={{ display: 'inline-block', background: '#AAFF0015', border: '1px solid #AAFF0030', borderRadius: '100px', padding: '6px 16px', fontSize: '12px', color: '#AAFF00', fontWeight: 600, marginBottom: '24px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Product Catalogue AI Assistant
          </div>
          <h1 style={{ fontSize: '54px', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}>
            Your Product Catalogue, Now <span style={{ color: '#AAFF00' }}>Searchable by AI</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '36px' }}>
            Upload your catalogue as PDFs or URLs. Let customers ask any question about any product in natural language and get an instant, accurate answer — without scrolling through hundreds of pages.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/sign-up" style={{ display: 'inline-block', background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '16px', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
              Start Free Today →
            </Link>
            <Link href="/blog/product-knowledge-management" style={{ display: 'inline-block', background: 'none', color: '#F0F0F0', fontWeight: 600, fontSize: '15px', padding: '16px 28px', borderRadius: '10px', textDecoration: 'none', border: '1px solid #2D3148' }}>
              Read About PKM
            </Link>
          </div>
        </div>

        {/* The catalogue problem */}
        <div style={{ marginBottom: '80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center', maxWidth: '900px', margin: '0 auto 80px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>The Problem With Large Catalogues</h2>
            <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.7, marginBottom: '16px' }}>
              A 200-page product catalogue is comprehensive — but it&apos;s not searchable. A customer who needs to know if SKU #4872 is compatible with their existing system doesn&apos;t have time to find page 156.
            </p>
            <p style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.7 }}>
              The result: unanswered questions, lost sales, and support tickets that could have been prevented. An AI assistant solves all three simultaneously.
            </p>
          </div>
          <div style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '14px', padding: '28px' }}>
            <div style={{ fontSize: '13px', color: '#4B5563', marginBottom: '16px', fontFamily: 'monospace' }}>Customer question:</div>
            <div style={{ background: '#161820', border: '1px solid #1E2028', borderRadius: '8px', padding: '14px', fontSize: '14px', color: '#D1D5DB', marginBottom: '14px', fontStyle: 'italic' }}>
              &ldquo;Does the Pro-X Series work with the 48V power supply we already have?&rdquo;
            </div>
            <div style={{ fontSize: '13px', color: '#4B5563', marginBottom: '12px', fontFamily: 'monospace' }}>AI answer (instant):</div>
            <div style={{ background: '#AAFF0008', border: '1px solid #AAFF0020', borderRadius: '8px', padding: '14px', fontSize: '14px', color: '#D1D5DB', lineHeight: 1.6 }}>
              Yes — the Pro-X Series supports input voltages from 36V to 60V DC, so your 48V supply is fully compatible. The recommended cable gauge for this configuration is 14 AWG.
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, textAlign: 'center', marginBottom: '48px', fontFamily: 'Outfit, sans-serif' }}>Built for Complex Product Ranges</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { icon: '📚', title: 'Bulk PDF Upload', desc: 'Upload entire product catalogues, specification sheets, and technical manuals. The AI indexes every page automatically.' },
              { icon: '🔍', title: 'Precise Retrieval', desc: 'When a customer asks about a specific model or SKU, the AI retrieves the exact specs — not a generic overview.' },
              { icon: '⚖️', title: 'Product Comparisons', desc: 'Customers can ask "what\'s the difference between X and Y?" and get a clear, accurate comparison from your actual documentation.' },
              { icon: '📁', title: 'Folder Organisation', desc: 'Organise your knowledge sources by product line, category, or brand. Keep your knowledge base structured as your catalogue grows.' },
              { icon: '🔄', title: 'Instant Updates', desc: 'When you release new products or update specs, upload the new document and the AI reflects it immediately. No retraining required.' },
              { icon: '🌍', title: 'Multi-Language Support', desc: 'The AI can respond in the language the customer writes in, extending your catalogue\'s reach to international customers.' },
            ].map(f => (
              <div key={f.title} style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '14px', padding: '28px' }}>
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Use cases */}
        <div style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px', padding: '48px', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, textAlign: 'center', marginBottom: '36px', fontFamily: 'Outfit, sans-serif' }}>Who Uses Catalogue AI Assistants</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { type: 'Manufacturers', desc: 'Make complex technical specs accessible to distributors, dealers, and end customers without a sales call.' },
              { type: 'Distributors', desc: 'Let customers search across thousands of SKUs from multiple brands with a single AI assistant.' },
              { type: 'B2B Sellers', desc: 'Answer technical procurement questions instantly, speeding up the sales cycle significantly.' },
              { type: 'Retailers', desc: 'Help shoppers find the right product from a large range without browsing through category pages.' },
            ].map(item => (
              <div key={item.type} style={{ padding: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#AAFF00', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{item.type}</div>
                <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
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
            Make your catalogue work harder
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            Upload your product catalogue today and have AI answering questions from it in under an hour.
          </p>
          <Link href="/sign-up" style={{ display: 'inline-block', background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '16px', padding: '16px 40px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
            Upload Your Catalogue →
          </Link>
        </div>
      </div>
    </>
  )
}
