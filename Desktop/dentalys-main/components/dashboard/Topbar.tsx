// components/dashboard/Topbar.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Bell, LogOut } from 'lucide-react'

interface TopbarProps {
  userName: string
  userEmail: string
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/conversations': 'Conversations',
  '/dashboard/bookings': 'Bookings',
  '/dashboard/customers': 'Customers',
  '/dashboard/customers/import': 'Import Customers',
  '/dashboard/customers/templates': 'Import Templates',
  '/dashboard/telegram': 'Telegram',
  '/dashboard/channels': 'Channel Analytics',
  '/dashboard/services': 'Services',
  '/dashboard/promotions': 'Promotions',
  '/dashboard/business-hours': 'Business Hours',
  '/dashboard/faq': 'FAQ',
  '/dashboard/templates': 'Templates',
  '/dashboard/calendar': 'Google Calendar',
  '/dashboard/handoffs': 'Handoffs',
  '/dashboard/billing': 'Billing',
  '/dashboard/settings': 'Settings',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Topbar({ userName, userEmail }: TopbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const title = PAGE_TITLES[pathname] || 'Dashboard'

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header
      className="flex h-[52px] shrink-0 items-center justify-between bg-white px-6"
      style={{ borderBottom: '0.5px solid #e7e5e4' }}
    >
      <h1 className="text-[15px] font-medium text-stone-800">{title}</h1>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-[11px] font-medium text-white"
          >
            {getInitials(userName)}
          </button>
          {dropdownOpen && (
            <div
              className="absolute right-0 top-10 z-50 w-56 rounded-xl bg-white py-2 animate-fadeIn"
              style={{ border: '0.5px solid #e7e5e4' }}
            >
              <div className="px-4 py-2">
                <p className="text-[13px] font-medium text-stone-800">
                  {userName}
                </p>
                <p className="truncate text-[12px] text-stone-400">
                  {userEmail}
                </p>
              </div>
              <div style={{ borderTop: '0.5px solid #e7e5e4' }} className="mt-1 pt-1">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
