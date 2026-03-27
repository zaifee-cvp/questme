// app/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('business_id, full_name')
    .eq('id', user.id)
    .single()

  if (!profile?.business_id) redirect('/onboarding')

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name, slug, onboarding_completed, setup_progress, telegram_bot_token, currency, timezone')
    .eq('id', profile.business_id)
    .single()

  if (!business?.onboarding_completed) redirect('/onboarding')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('business_id', profile.business_id)
    .maybeSingle()

  const { count: pendingHandoffs } = await supabase
    .from('handoff_requests')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', profile.business_id)
    .eq('status', 'pending')

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50">
      <Sidebar
        businessName={business.name}
        businessSlug={business.slug}
        telegramEnabled={!!business.telegram_bot_token}
        plan={subscription?.plan || 'free'}
        planStatus={subscription?.status || 'trialing'}
        pendingHandoffs={pendingHandoffs || 0}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          userName={profile.full_name || user.email?.split('@')[0] || 'User'}
          userEmail={user.email || ''}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
