'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils/formatters'
import {
  LayoutDashboard, Users, Settings, FileText, Wrench, QrCode,
  ClipboardList, BarChart3, ChevronLeft, ChevronRight, LogOut, Menu, X, CreditCard
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/swo', label: 'Work Orders', icon: ClipboardList },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/technicians', label: 'Technicians', icon: Wrench },
  { href: '/dashboard/qrcodes', label: 'QR Codes', icon: QrCode },
  { href: '/dashboard/services', label: 'Services', icon: FileText },
  { href: '/dashboard/service-templates', label: 'Templates', icon: Settings },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
]

interface SidebarProps {
  companyName: string
  logoUrl?: string | null
  userName: string
}

export function AdminSidebar({ companyName, logoUrl, userName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const isActive = (item: { href: string; exact?: boolean }) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo + Company */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-[#ffffff20]',
        collapsed && 'justify-center px-2'
      )}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded object-contain bg-white p-0.5 flex-shrink-0" />
        ) : (
          <div className="h-8 w-8 rounded bg-[#e05a2b] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">{companyName.charAt(0).toUpperCase()}</span>
          </div>
        )}
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-semibold text-sm truncate">{companyName}</p>
            <p className="text-[#9cb3cc] text-xs">Admin</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-[#ffffff20] text-white font-medium'
                  : 'text-[#9cb3cc] hover:bg-[#ffffff12] hover:text-white',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {active && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#e05a2b]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User + Sign Out */}
      <div className={cn(
        'p-4 border-t border-[#ffffff20]',
        collapsed && 'flex justify-center'
      )}>
        {!collapsed && (
          <div className="mb-3">
            <p className="text-white text-xs font-medium truncate">{userName}</p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className={cn(
            'flex items-center gap-2 text-[#9cb3cc] hover:text-white transition-colors text-sm w-full',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col h-screen bg-[#1e3a5f] sticky top-0 transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-14 bg-[#1e3a5f] border border-[#ffffff20] rounded-full p-1 text-white shadow-md hover:bg-[#162d4a] z-10"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#1e3a5f] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-[#e05a2b] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">{companyName.charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-white font-semibold text-sm">{companyName}</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-1">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40 top-12" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed top-12 left-0 bottom-0 w-64 bg-[#1e3a5f] z-50 overflow-y-auto">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
