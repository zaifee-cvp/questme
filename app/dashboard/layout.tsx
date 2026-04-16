import DashboardNav from '@/components/DashboardNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080A0E' }}>
      <DashboardNav />
      <main className="dash-main" style={{ flex: 1, overflow: 'auto', padding: '32px', maxWidth: '1100px' }}>
        {children}
      </main>
    </div>
  )
}
