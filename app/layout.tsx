import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Questme.ai — AI Product Knowledge Bot',
  description: 'Upload your product knowledge. Get an embeddable AI assistant that answers every customer question instantly and accurately.',
  openGraph: {
    title: 'Questme.ai — AI Product Knowledge Bot',
    description: 'Turn your docs into an AI that answers customers 24/7.',
    url: 'https://questme.ai',
    siteName: 'Questme.ai',
    images: [
      {
        url: 'https://questme.ai/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Questme.ai — AI Product Knowledge Bot',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Questme.ai — AI Product Knowledge Bot',
    description: 'Turn your docs into an AI that answers customers 24/7.',
    images: ['https://questme.ai/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
