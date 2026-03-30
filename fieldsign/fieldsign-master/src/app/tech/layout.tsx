import type { Viewport } from 'next'
import { TechProvider } from '@/contexts/TechContext'

export const metadata = {
  title: 'Technician App | FieldService',
  description: 'FieldService Technician Mobile App',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function TechLayout({ children }: { children: React.ReactNode }) {
  return (
    <TechProvider>
      <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
        {children}
      </div>
    </TechProvider>
  )
}
