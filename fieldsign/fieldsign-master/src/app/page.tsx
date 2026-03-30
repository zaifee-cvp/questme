import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/supabase/server'

export default async function RootPage() {
  const user = await getServerUser()
  // Authenticated users go straight to their dashboard
  if (user) redirect('/dashboard')
  // Unauthenticated visitors see the landing page
  redirect('/landing.html')
}
