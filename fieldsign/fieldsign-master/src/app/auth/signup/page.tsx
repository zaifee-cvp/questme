import { Suspense } from 'react'
import SignupInner from './inner'

export const dynamic = 'force-dynamic'

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-gray-900 rounded-full" />
      </div>
    }>
      <SignupInner />
    </Suspense>
  )
}
