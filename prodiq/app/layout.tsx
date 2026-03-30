import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Questme.ai — AI Product Knowledge Bot',
  description: 'Upload your product knowledge. Get an embeddable AI assistant that answers every customer question instantly and accurately.',
  openGraph: {
    title: 'Questme.ai — AI Product Knowledge Bot',
    description: 'Turn your docs into an AI that answers customers 24/7.',
    url: 'https://questme.ai',
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
