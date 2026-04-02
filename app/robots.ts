import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/auth/', '/_next/'],
      },
    ],
    sitemap: 'https://www.questme.ai/sitemap.xml',
  }
}
