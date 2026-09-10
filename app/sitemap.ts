import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

/**
 * Every entry used to be stamped with `new Date()` — the build time — so all 32
 * URLs claimed to change on every deploy. Google learns to distrust that and
 * stops using lastmod as a recrawl signal at all.
 *
 * Blog posts carry an explicit modified date (post.updated in lib/blog.ts),
 * falling back to their published date; the marketing pages carry a fixed
 * literal that is bumped by hand when the copy actually changes. None of these
 * may ever be derived from the build.
 *
 * The published date alone is not enough: a post whose page changed today but
 * was written 18 months ago would tell Google it has nothing new.
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

  const modifiedOf = (post: (typeof blogPosts)[number]) => post.updated ?? post.date

  // The index changes when its most recently modified post does.
  const newestPostDate = blogPosts.reduce(
    (latest, post) => (modifiedOf(post) > latest ? modifiedOf(post) : latest),
    modifiedOf(blogPosts[0]),
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
      lastModified: new Date(modifiedOf(post)),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
