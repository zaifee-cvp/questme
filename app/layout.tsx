import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://questme.ai'),
  title: {
    default: 'Questme.ai — AI Product Knowledge Chatbot for Businesses',
    template: '%s | Questme.ai',
  },
  description: 'Questme.ai lets businesses deploy an AI chatbot trained on their own product knowledge. Instantly answer customer questions on WhatsApp, your website, and more.',
  alternates: { canonical: 'https://questme.ai' },
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: 'https://questme.ai',
    siteName: 'Questme.ai',
    title: 'Questme.ai — AI Product Knowledge Chatbot for Businesses',
    description: 'Train an AI chatbot on your business knowledge. Answer customer questions instantly on WhatsApp and your website — 24/7.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Questme.ai' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Questme.ai — AI Product Knowledge Chatbot for Businesses',
    description: 'Deploy an AI chatbot trained on your own product and service knowledge. Never miss a customer question again.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Questme.ai',
  url: 'https://questme.ai',
  logo: 'https://questme.ai/logo.png',
  description: 'AI product knowledge chatbot SaaS. Train your AI on your own business data and answer customer questions instantly.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@questme.ai',
  },
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Questme.ai',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    price: '88',
  },
  description: 'AI chatbot trained on your own product knowledge. Deploy on WhatsApp and your website to answer customer questions 24/7.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
