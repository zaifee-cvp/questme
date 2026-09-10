import type { Metadata } from 'next'

// The page itself is a client component ('use client'), which cannot export
// metadata. This layout exists solely to carry it.
export const metadata: Metadata = {
  // absolute: the root layout's '%s | Questme.ai' template would otherwise
  // append a second ' | Questme.ai' to a title that already carries the brand.
  title: { absolute: 'Create your account — Questme.ai' },
  description: 'Create your Questme.ai account and deploy an AI chatbot trained on your own product knowledge.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://questme.ai/sign-up' },
}

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
