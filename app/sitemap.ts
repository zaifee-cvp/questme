import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

/**
 * Every entry used to be stamped with `new Date()` — the build time — so all 32
 * URLs claimed to change on every deploy. Google learns to distrust that and
 * stops using lastmod as a recrawl signal at all.
 *
 * Blog posts now carry their own published date; the marketing pages carry a
 * fixed literal that is bumped by hand when the copy actually changes. Neither
 * must ever be derived from the build.
 */
const MARKETING_LAST_MODIFIED = new Date('2026-09-10')

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://questme.ai'

  const featurePages = [
    'ai-product-knowledge-bot',
    'embeddable-ai-chat-widget',
    'ai-faq-bot-for-ecommerce',
    'customer-support-automation',
    'product-catalog-ai-assistant',
  ]

  // SEO landing pages
  const landingPages = [
    'ai-customer-support-chatbot',
    'ai-product-knowledge-chatbot',
    'ai-chatbot-for-small-business',
    'whatsapp-ai-chatbot-for-business',
    'website-ai-chatbot-for-lead-generation',
    'automated-customer-enquiry-system',
    'ai-chatbot-for-business',
    'website-ai-chatbot',
    'chatbot-for-lead-generation',
  ]

  // Driven off the post data rather than a parallel hardcoded list, so the
  // sitemap cannot drift from what /blog actually publishes.
  const blogPosts = getAllPosts()

  // The index changes when its newest post does.
  const newestPostDate = blogPosts.reduce(
    (latest, post) => (post.date > latest ? post.date : latest),
    blogPosts[0].date,
  )

  return [
    { url: base, lastModified: MARKETING_LAST_MODIFIED, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(newestPostDate), changeFrequency: 'weekly', priority: 0.8 },
    ...landingPages.map(slug => ({
      url: `${base}/${slug}`,
      lastModified: MARKETING_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...featurePages.map(slug => ({
      url: `${base}/features/${slug}`,
      lastModified: MARKETING_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...blogPosts.map(post => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
