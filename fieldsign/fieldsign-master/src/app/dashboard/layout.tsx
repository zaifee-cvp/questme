import { redirect } from 'next/navigation'
import { getServerProfile } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'
import FeedbackButton from '@/components/FeedbackButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getServerProfile() as any

  if (!profile) redirect('/auth/login')
  if (profile.role !== 'admin') redirect('/auth/login')

  const company = profile.companies

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar
        companyName={company?.company_name ?? 'Company'}
        logoUrl={company?.logo_url}
        userName={profile.name}
      />
      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="pt-14 lg:pt-0">
          {children}
        </div>
      </main>
      <FeedbackButton />
    </div>
  )
}
