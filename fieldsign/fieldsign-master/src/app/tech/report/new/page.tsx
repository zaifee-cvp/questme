import { Suspense } from 'react'
import { Spinner } from '@/components/ui'
import NewReportInner from './inner'

export default function NewReportPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    }>
      <NewReportInner />
    </Suspense>
  )
}
