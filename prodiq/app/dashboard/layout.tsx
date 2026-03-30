'use client'
import Link from 'next/link'
import FeedbackButton from '@/components/FeedbackButton'
import { usePathname, useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { LayoutDashboard, BarChart3, Mail, CreditCard, Settings, HelpCircle, LogOut } from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'My Bots', icon: LayoutDashboard },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/leads', label: 'Leads', icon: Mail },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/help', label: 'Help', icon: HelpCircle },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080A0E' }}>
      <aside style={{ width: '220px', minHeight: '100vh', background: '#0F1117', borderRight: '1px solid #1E2028', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #1E2028' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', background: '#AAFF00', borderRadius: '7px', fontWeight: 900, fontSize: '14px', color: '#080A0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>Q</div>
            <span style={{ fontWeight: 700, fontSize: '16px', fontFamily: 'Outfit, sans-serif', color: '#F0F0F0' }}>Questme<span style={{ color: '#AAFF00' }}>.ai</span></span>
          </Link>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '8px', marginBottom: '2px', background: active ? '#AAFF0015' : 'transparent', color: active ? '#AAFF00' : '#9CA3AF', textDecoration: 'none', fontSize: '14px', fontWeight: active ? 600 : 400, border: active ? '1px solid #AAFF0030' : '1px solid transparent', transition: 'all 0.15s' }}>
                <Icon size={16} />{label}
              </Link>
            )
          })}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid #1E2028' }}>
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '14px', padding: '9px 10px', width: '100%', borderRadius: '8px', fontFamily: 'DM Sans, sans-serif' }}>
            <LogOut size={16} />Sign out
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: 'auto', padding: '32px', maxWidth: '1100px' }}>
        {children}
      </main>
      <FeedbackButton />
    </div>
  )
}
