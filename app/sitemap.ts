import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://questme.ai'
  const now = new Date().toISOString()

  const featurePages = [
    'ai-product-knowledge-bot',
    'embeddable-ai-chat-widget',
    'ai-faq-bot-for-ecommerce',
    'customer-support-automation',
    'product-catalog-ai-assistant',
  ]

  const blogSlugs = [
    'what-is-a-product-knowledge-bot',
    'reduce-customer-support-tickets',
    'embed-ai-chat-on-website',
    'ai-faq-for-ecommerce',
    'product-knowledge-management',
    'ai-customer-support-tools',
    'chatbot-vs-knowledge-bot',
    'increase-conversion-with-ai-chat',
    'self-service-customer-support',
    'ai-for-product-sellers',
  ]

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/sign-up`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/sign-in`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...featurePages.map(slug => ({
      url: `${base}/features/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...blogSlugs.map(slug => ({
      url: `${base}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
