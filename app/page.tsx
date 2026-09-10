import type { Metadata } from 'next'
import LandingPage from '@/components/LandingPage'

/**
 * The landing UI is a client component (hooks, IntersectionObserver), and a
 * client component cannot export metadata. This page stays a Server Component
 * purely so it can carry the homepage's own canonical.
 *
 * The root layout deliberately no longer sets alternates.canonical: it applied
 * the homepage URL to every page that did not override it, which is what caused
 * Google to drop /blog, /blog/*, /features/* and the auth pages. Each page now
 * declares its own, and this is the homepage's.
 */
export const metadata: Metadata = {
  alternates: { canonical: 'https://questme.ai' },
}

export default function Page() {
  return <LandingPage />
}
