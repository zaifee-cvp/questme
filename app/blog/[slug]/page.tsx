import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPost, getAllSlugs, getAllPosts, BlogSection } from '@/lib/blog'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://questme.ai/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

function renderSection(section: BlogSection, index: number) {
  const baseStyle = { lineHeight: 1.8 }

  switch (section.type) {
    case 'h2':
      return (
        <h2 key={index} style={{ fontSize: '24px', fontWeight: 700, color: '#F0F0F0', marginTop: '48px', marginBottom: '16px', fontFamily: 'Outfit, sans-serif' }}>
          {section.content as string}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={index} style={{ fontSize: '18px', fontWeight: 600, color: '#E5E7EB', marginTop: '32px', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>
          {section.content as string}
        </h3>
      )
    case 'p':
      return (
        <p key={index} style={{ ...baseStyle, fontSize: '16px', color: '#9CA3AF', marginBottom: '20px' }}>
          {section.content as string}
        </p>
      )
    case 'ul':
      return (
        <ul key={index} style={{ listStyle: 'none', padding: 0, marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(section.content as string[]).map((item, i) => (
            <li key={i} style={{ ...baseStyle, fontSize: '15px', color: '#9CA3AF', paddingLeft: '20px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#AAFF00', fontWeight: 700 }}>›</span>
              {item}
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={index} style={{ listStyle: 'none', padding: 0, marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px', counterReset: 'step-counter' }}>
          {(section.content as string[]).map((item, i) => (
            <li key={i} style={{ ...baseStyle, fontSize: '15px', color: '#9CA3AF', paddingLeft: '28px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#AAFF00', fontWeight: 700, fontFamily: 'Outfit, sans-serif', fontSize: '13px' }}>{i + 1}.</span>
              {item}
            </li>
          ))}
        </ol>
      )
    case 'blockquote':
      return (
        <blockquote key={index} style={{ borderLeft: '3px solid #AAFF00', paddingLeft: '20px', margin: '24px 0', fontFamily: 'monospace', fontSize: '13px', color: '#AAFF00', background: '#AAFF0008', padding: '16px 20px', borderRadius: '0 8px 8px 0', wordBreak: 'break-all' }}>
          {section.content as string}
        </blockquote>
      )
    default:
      return null
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const allPosts = getAllPosts()
  const related = allPosts.filter(p => p.slug !== post.slug).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Questme.ai', url: 'https://questme.ai' },
    publisher: { '@type': 'Organization', name: 'Questme.ai', url: 'https://questme.ai' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://questme.ai/blog/${post.slug}` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr min(680px, 100%) 1fr', gap: '0' }}>
          <div />
          <main>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#4B5563', marginBottom: '32px' }}>
              <Link href="/blog" style={{ color: '#6B7280', textDecoration: 'none' }}>Blog</Link>
              <span>›</span>
              <span style={{ color: '#9CA3AF' }}>{post.category}</span>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#AAFF00', background: '#AAFF0015', border: '1px solid #AAFF0030', borderRadius: '100px', padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {post.category}
                </span>
                <span style={{ fontSize: '13px', color: '#4B5563' }}>{post.readTime} min read</span>
                <span style={{ fontSize: '13px', color: '#4B5563' }}>
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 style={{ fontSize: '40px', fontWeight: 800, lineHeight: 1.2, color: '#F0F0F0', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
                {post.title}
              </h1>
              <p style={{ fontSize: '18px', color: '#6B7280', lineHeight: 1.7 }}>
                {post.description}
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: '#1E2028', marginBottom: '48px' }} />

            {/* Content */}
            <div>
              {post.sections.map((section, i) => renderSection(section, i))}
            </div>

            {/* CTA */}
            <div style={{ marginTop: '64px', background: '#0F1117', border: '1px solid #AAFF0030', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', background: '#AAFF00', borderRadius: '12px', fontWeight: 900, fontSize: '22px', color: '#080A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', margin: '0 auto 16px' }}>Q</div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>
                Try Questme.ai Free
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>
                Upload your product docs and get an AI chat widget answering customer questions in under 30 minutes.
              </p>
              <Link href="/sign-up" style={{ display: 'inline-block', background: '#AAFF00', color: '#080A0E', fontWeight: 700, fontSize: '14px', padding: '12px 28px', borderRadius: '9px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
                Start Free Today →
              </Link>
            </div>
          </main>
          <div />
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div style={{ marginTop: '80px', paddingTop: '56px', borderTop: '1px solid #1E2028' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '32px', fontFamily: 'Outfit, sans-serif' }}>More from the blog</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {related.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
                  <article style={{ background: '#0F1117', border: '1px solid #1E2028', borderRadius: '12px', padding: '24px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#AAFF00', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.category}</span>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#F0F0F0', lineHeight: 1.4, margin: '10px 0 8px', fontFamily: 'Outfit, sans-serif' }}>{p.title}</h3>
                    <span style={{ fontSize: '12px', color: '#AAFF00', fontWeight: 600 }}>Read →</span>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
