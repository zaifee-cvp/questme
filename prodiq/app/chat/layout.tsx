import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#AAFF00',
}

export const metadata: Metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Questme',
  },
  icons: {
    apple: '/icon-192.png',
  },
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
