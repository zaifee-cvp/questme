// components/dashboard/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  CalendarCheck2,
  Users,
  Send,
  BarChart2,
  Stethoscope,
  Tag,
  Clock,
  HelpCircle,
  Layers,
  Calendar,
  UserCheck,
  CreditCard,
  BookOpen,
  Settings,
  ArrowRight,
} from 'lucide-react'

interface SidebarProps {
  businessName: string
  businessSlug: string
  telegramEnabled: boolean
  plan: string
  planStatus: string
  pendingHandoffs: number
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string | number
  badgeColor?: string
}

export function Sidebar({
  businessName,
  plan,
  planStatus,
  pendingHandoffs,
}: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const mainNav: NavItem[] = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    {
      label: 'Conversations',
      href: '/dashboard/conversations',
      icon: MessageSquare,
    },
    { label: 'Bookings', href: '/dashboard/bookings', icon: CalendarCheck2 },
    { label: 'Customers', href: '/dashboard/customers', icon: Users },
  ]

  const channelNav: NavItem[] = [
    { label: 'Telegram', href: '/dashboard/telegram', icon: Send },
    {
      label: 'Channel Analytics',
      href: '/dashboard/channels',
      icon: BarChart2,
    },
  ]

  const configNav: NavItem[] = [
    { label: 'Services', href: '/dashboard/services', icon: Stethoscope },
    { label: 'Promotions', href: '/dashboard/promotions', icon: Tag },
    {
      label: 'Business Hours',
      href: '/dashboard/business-hours',
      icon: Clock,
    },
    { label: 'FAQ', href: '/dashboard/faq', icon: HelpCircle },
    { label: 'Templates', href: '/dashboard/templates', icon: Layers },
  ]

  const integrationNav: NavItem[] = [
    {
      label: 'Google Calendar',
      href: '/dashboard/calendar',
      icon: Calendar,
    },
  ]

  const accountNav: NavItem[] = [
    { label: 'Help', href: '/dashboard/help', icon: BookOpen },
    {
      label: 'Handoffs',
      href: '/dashboard/handoffs',
      icon: UserCheck,
      badge: pendingHandoffs > 0 ? pendingHandoffs : undefined,
      badgeColor: 'bg-red-100 text-red-700',
    },
    { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const renderGroup = (label: string, items: NavItem[]) => (
    <div key={label} className="mb-4">
      <p className="mb-1.5 px-3 text-[10px] font-medium uppercase tracking-wider text-stone-400">
        {label}
      </p>
      {items.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${
              active
                ? 'bg-teal-50 font-medium text-teal-700'
                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'
            }`}
          >
            {active && (
              <div className="absolute right-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-l bg-teal-600" />
            )}
            <item.icon className={`h-4 w-4 shrink-0 ${active ? 'text-teal-600' : 'text-stone-400 group-hover:text-stone-500'}`} />
            <span className="flex-1">{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={`inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                  item.badgeColor || 'bg-red-100 text-red-700'
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )

  const isPaid = plan === 'starter' || plan === 'pro'
  const isTrial = planStatus === 'trialing'

  return (
    <aside
      className="flex h-full w-60 shrink-0 flex-col bg-white"
      style={{ borderRight: '0.5px solid #e7e5e4' }}
    >
      {/* Logo */}
      <div className="px-5 pb-2 pt-5">
        <Link
          href="/dashboard"
          className="text-[15px] font-medium tracking-[-0.3px] text-stone-800"
        >
          Dentalys<span className="text-teal-600">.</span>ai
        </Link>
        <p className="mt-0.5 truncate text-[11px] text-stone-400">
          {businessName}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
        {renderGroup('Main', mainNav)}
        {renderGroup('Channels', channelNav)}
        {renderGroup('Configuration', configNav)}
        {renderGroup('Integrations', integrationNav)}
        {renderGroup('Account', accountNav)}
      </nav>

      {/* Plan pill */}
      <div className="px-4 pb-4">
        {isPaid && !isTrial ? (
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[12px] font-medium capitalize text-emerald-700">
              {plan} plan
            </span>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
              <span className="text-[12px] font-medium text-teal-700">
                {isTrial ? 'Trial' : 'Free'}
              </span>
            </div>
            <Link
              href="/dashboard/billing"
              className="mt-1.5 flex items-center gap-1 px-3 text-[11px] text-teal-600 hover:text-teal-700 transition-colors"
            >
              Upgrade now <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}
