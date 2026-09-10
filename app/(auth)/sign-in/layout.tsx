import type { Metadata } from 'next'

// The page itself is a client component ('use client'), which cannot export
// metadata. This layout exists solely to carry it.
export const metadata: Metadata = {
  // absolute: the root layout's '%s | Questme.ai' template would otherwise
  // append a second ' | Questme.ai' to a title that already carries the brand.
  title: { absolute: 'Sign in — Questme.ai' },
  description: 'Sign in to your Questme.ai dashboard.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://questme.ai/sign-in' },
}

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
