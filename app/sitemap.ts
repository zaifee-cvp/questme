import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.questme.ai'
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
    // Added: SEO-targeted blog posts
    'how-ai-chatbots-help-businesses-respond-instantly',
    'whatsapp-ai-chatbots-for-customer-support',
    'why-businesses-lose-leads-without-instant-response',
    'how-ai-answers-customer-questions-using-product-data',
    'ai-chatbots-vs-human-support-cost-efficiency',
    'how-to-turn-website-visitors-into-leads-using-ai',
  ]

  // SEO landing pages
  const landingPages = [
    'ai-customer-support-chatbot',
    'ai-product-knowledge-chatbot',
    'ai-chatbot-for-small-business',
    'whatsapp-ai-chatbot-for-business',
    'website-ai-chatbot-for-lead-generation',
    'automated-customer-enquiry-system',
  ]

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
{ url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...landingPages.map(slug => ({
      url: `${base}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
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
