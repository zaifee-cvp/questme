import { createServerSupabaseClient, getServerProfile } from '@/lib/supabase/server'
import Link from 'next/link'
import { ClipboardList, Users, Wrench, BarChart3, Plus, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils/formatters'

async function getDashboardStats(companyId: string) {
  const supabase = await createServerSupabaseClient()
  const today = new Date().toISOString().split('T')[0]
  const thisMonth = new Date()
  thisMonth.setDate(1)

  const [swos, reports, clients, technicians, recentReports] = await Promise.all([
    supabase.from('swos').select('status', { count: 'exact' }).eq('company_id', companyId),
    supabase.from('work_orders').select('id', { count: 'exact' }).eq('company_id', companyId).eq('status', 'Completed'),
    supabase.from('clients').select('id', { count: 'exact' }).eq('company_id', companyId),
    supabase.from('technicians').select('id', { count: 'exact' }).eq('company_id', companyId).eq('status', 'active'),
    supabase.from('work_orders')
      .select('id, service_report_no, client_name, technician_name, service_date, status, service_id, services(service_name)')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const swoByStatus = (swos.data ?? []).reduce((acc: Record<string, number>, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1
    return acc
  }, {})

  return {
    totalSwos: swos.count ?? 0,
    completedReports: reports.count ?? 0,
    totalClients: clients.count ?? 0,
    activeTechnicians: technicians.count ?? 0,
    openSwos: (swoByStatus['New'] ?? 0) + (swoByStatus['Assigned'] ?? 0) + (swoByStatus['In Progress'] ?? 0),
    recentReports: recentReports.data ?? [],
  }
}

export default async function DashboardPage() {
  const profile = await getServerProfile() as any
  const stats = await getDashboardStats(profile.company_id)

  const statCards = [
    { label: 'Open Work Orders', value: stats.openSwos, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50', href: '/dashboard/swo' },
    { label: 'Reports This Month', value: stats.completedReports, icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50', href: '/dashboard/reports' },
    { label: 'Total Clients', value: stats.totalClients, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', href: '/dashboard/clients' },
    { label: 'Active Technicians', value: stats.activeTechnicians, icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-50', href: '/dashboard/technicians' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Welcome back, {profile.name}</p>
        </div>
        <Link
          href="/dashboard/swo/new"
          className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#162d4a] transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Work Order
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.label} href={card.href}>
              <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`${card.bg} p-3 rounded-lg`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Reports</h2>
          <Link href="/dashboard/reports" className="text-sm text-[#1e3a5f] hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {stats.recentReports.length === 0 ? (
            <div className="py-12 text-center">
              <BarChart3 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No reports yet</p>
              <p className="text-gray-400 text-xs mt-1">Reports will appear here once technicians submit them</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Report No', 'Client', 'Service', 'Technician', 'Date', 'Status'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentReports.map((report: any) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-[#1e3a5f]">{report.service_report_no}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{report.client_name}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{(report.services as any)?.service_name ?? '-'}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{report.technician_name}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{report.service_date ? formatDate(report.service_date) : '-'}</td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/dashboard/clients/new', label: 'Add Client', icon: Users, desc: 'Register a new client' },
          { href: '/dashboard/technicians/new', label: 'Add Technician', icon: Wrench, desc: 'Onboard a technician' },
          { href: '/dashboard/qrcodes/new', label: 'Generate QR Code', icon: ClipboardList, desc: 'Create a QR for technician access' },
        ].map(action => {
          const Icon = action.icon
          return (
            <Link key={action.href} href={action.href} className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="bg-[#f0f4f9] p-2.5 rounded-lg">
                <Icon className="h-4 w-4 text-[#1e3a5f]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                <p className="text-xs text-gray-500">{action.desc}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
