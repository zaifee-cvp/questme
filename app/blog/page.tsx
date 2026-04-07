import { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog — AI Product Knowledge & Customer Support',
  description: 'Practical guides on AI product knowledge bots, customer support automation, and e-commerce conversion. Written for product businesses.',
  openGraph: {
    title: 'Questme.ai Blog — AI Product Knowledge & Customer Support',
    description: 'Practical guides on AI product knowledge bots, customer support automation, and e-commerce conversion.',
    url: 'https://questme.ai/blog',
    type: 'website',
  },
}

const categoryColors: Record<string, string> = {
  Guides: '#AAFF00',
  'Customer Support': '#60A5FA',
  'How-To': '#34D399',
  'E-commerce': '#F59E0B',
  Strategy: '#A78BFA',
  Tools: '#F87171',
  Conversion: '#FB923C',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 32px' }}>
      {/* Header */}
      <div style={{ maxWidth: '640px', marginBottom: '56px' }}>
        <div style={{ display: 'inline-block', background: '#AAFF0015', border: '1px solid #AAFF0030', borderRadius: '100px', padding: '6px 14px', fontSize: '12px', color: '#AAFF00', fontWeight: 600, marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          The Questme Blog
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px', fontFamily: 'Outfit, sans-serif' }}>
          AI, Product Knowledge<br />& Customer Support
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: 1.7 }}>
          Practical guides for product businesses using AI to answer customer questions, reduce support tickets, and grow conversions.
        </p>
      </div>

      {/* Posts grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {posts.map(post => {
          const accentColor = categoryColors[post.category] || '#AAFF00'
          return (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <article style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '14px', padding: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: accentColor, background: `${accentColor}15`, border: `1px solid ${accentColor}30`, borderRadius: '100px', padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {post.category}
                  </span>
                  <span style={{ fontSize: '12px', color: '#4B5563' }}>{post.readTime} min read</span>
                </div>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#F0F0F0', lineHeight: 1.4, marginBottom: '12px', fontFamily: 'Outfit, sans-serif', flex: 1 }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, marginBottom: '20px' }}>
                  {post.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#4B5563' }}>
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span style={{ fontSize: '13px', color: '#AAFF00', fontWeight: 600 }}>Read →</span>
                </div>
              </article>
            </Link>
          )
        })}
      </div>

      {/* CTA */}
      <div style={{ marginTop: '80px', background: '#0F1117', border: '1px solid #1E2028', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>
          Ready to deploy your own AI knowledge bot?
        </h2>
        <p style={{ color: '#9CA3AF', fontSize: '15px', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>
          Upload your product docs, FAQs, and URLs — and have an AI answering customer questions in under 30 minutes.
        </p>
        <Link href="/sign-up" style={{ display: 'inline-block', background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '15px', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
          Start Free Today →
        </Link>
      </div>
    </div>
  )
}
