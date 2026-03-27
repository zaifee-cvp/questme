// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'dentalys.ai — AI Receptionist for Clinics Worldwide',
    template: '%s | dentalys.ai',
  },
  description:
    'AI-powered dental receptionist that books appointments and sends recall reminders 24/7 on Telegram.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://dentalys.ai'
  ),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  )
}
