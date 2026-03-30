import { Suspense } from 'react'
import { Spinner } from '@/components/ui'
import TechHomeInner from './inner'

export default function TechHomePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    }>
      <TechHomeInner />
    </Suspense>
  )
}
