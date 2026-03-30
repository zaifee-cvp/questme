'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { technicianSchema, type TechnicianInput } from '@/schemas'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, FormField, Modal, EmptyState, Badge, Spinner, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui'
import { PlanLimitBanner } from '@/components/ui/plan-limit-banner'
import type { Technician } from '@/types'
import { Plus, Edit2, Wrench, UserCheck, UserX, ArrowUpRight } from 'lucide-react'
import { formatDate } from '@/lib/utils/formatters'
import Link from 'next/link'

interface PlanInfo {
  plan: string
  limits: { technicians: number }
  usage: { technicians: number }
}

export default function TechniciansPage() {
  const supabase = createClient()
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [editing, setEditing] = useState<Technician | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TechnicianInput>({
    resolver: zodResolver(technicianSchema),
  })

  const fetchTechnicians = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('technicians').select('*').order('name')
    setTechnicians(data ?? [])
    setLoading(false)
  }, [])

  const fetchPlanInfo = useCallback(async () => {
    try {
      const res = await fetch('/api/billing/limits')
      if (res.ok) setPlanInfo(await res.json())
    } catch { /* non-critical */ }
  }, [])

  useEffect(() => {
    fetchTechnicians()
    fetchPlanInfo()
  }, [fetchTechnicians, fetchPlanInfo])

  const active = technicians.filter(t => t.status === 'active')
  const inactive = technicians.filter(t => t.status === 'inactive')

  const techLimit = planInfo?.limits.technicians ?? -1
  const atLimit = techLimit !== -1 && active.length >= techLimit

  const openCreate = () => {
    if (atLimit) {
      setUpgradeModalOpen(true)
      return
    }
    setEditing(null)
    reset({ name: '', email: '', phone: '', employee_id: '', status: 'active' })
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (tech: Technician) => {
    setEditing(tech)
    setValue('name', tech.name)
    setValue('email', tech.email ?? '')
    setValue('phone', tech.phone ?? '')
    setValue('employee_id', tech.employee_id ?? '')
    setValue('status', tech.status)
    setError(null)
    setModalOpen(true)
  }

  const onSubmit = async (data: TechnicianInput) => {
    setSaveLoading(true)
    setError(null)
    const cleanData = {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      employee_id: data.employee_id || null,
      status: data.status,
    }
    try {
      if (editing) {
        // Edits go directly via Supabase (no limit concern)
        const { error } = await supabase.from('technicians').update(cleanData).eq('id', editing.id)
        if (error) throw error
      } else {
        // Creates go via API to enforce plan limits server-side
        const res = await fetch('/api/technicians', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanData),
        })
        const result = await res.json()
        if (!result.success) {
          if (res.status === 409) {
            setModalOpen(false)
            setUpgradeModalOpen(true)
            return
          }
          throw new Error(result.error)
        }
      }
      setModalOpen(false)
      fetchTechnicians()
      fetchPlanInfo()
    } catch (err: any) {
      setError(err.message ?? 'Failed to save technician')
    } finally {
      setSaveLoading(false)
    }
  }

  const toggleStatus = async (tech: Technician) => {
    const newStatus = tech.status === 'active' ? 'inactive' : 'active'
    // Check limit when re-activating
    if (newStatus === 'active' && atLimit) {
      setUpgradeModalOpen(true)
      return
    }
    await supabase.from('technicians').update({ status: newStatus }).eq('id', tech.id)
    fetchTechnicians()
    fetchPlanInfo()
  }

  const planLabel = planInfo?.plan ?? 'current'
  const planDisplayName = planLabel === 'trial' ? 'trial' : planLabel

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Technicians</h1>
          <p className="text-gray-500 text-sm mt-1">{active.length} active · {inactive.length} inactive</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add Technician</Button>
      </div>

      {/* Plan limit banner */}
      {planInfo && (
        <PlanLimitBanner
          current={active.length}
          limit={techLimit}
          label="Technicians"
          icon={<Wrench className="h-4 w-4" />}
          className="mb-4"
        />
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : technicians.length === 0 ? (
          <EmptyState
            icon={<Wrench className="h-12 w-12" />}
            title="No technicians yet"
            description="Add technicians to assign them work orders and generate QR codes."
            action={<Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add Technician</Button>}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.map(tech => (
                <TableRow key={tech.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {tech.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{tech.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{tech.employee_id ?? '-'}</TableCell>
                  <TableCell className="text-gray-600">{tech.phone ?? '-'}</TableCell>
                  <TableCell className="text-gray-600">{tech.email ?? '-'}</TableCell>
                  <TableCell>
                    <Badge variant={tech.status === 'active' ? 'success' : 'default'}>
                      {tech.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-xs">{formatDate(tech.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(tech)}
                        className="p-1.5 text-gray-400 hover:text-[#1e3a5f] transition-colors"
                        title={tech.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {tech.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                      <button onClick={() => openEdit(tech)} className="p-1.5 text-gray-400 hover:text-[#1e3a5f]">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Technician' : 'Add Technician'} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Full Name" required error={errors.name?.message}>
            <Input {...register('name')} placeholder="John Tan" error={errors.name?.message} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Employee ID" error={errors.employee_id?.message}>
              <Input {...register('employee_id')} placeholder="EMP-001" />
            </FormField>
            <FormField label="Phone" error={errors.phone?.message}>
              <Input {...register('phone')} placeholder="+65 9123 4567" />
            </FormField>
          </div>
          <FormField label="Email" error={errors.email?.message}>
            <Input type="email" {...register('email')} placeholder="john@company.com" />
          </FormField>
          <FormField label="Status">
            <select {...register('status')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </FormField>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saveLoading} className="flex-1">
              {editing ? 'Save Changes' : 'Add Technician'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Upgrade Modal */}
      <Modal open={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} title="Technician limit reached" size="sm">
        <div className="space-y-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 mx-auto">
            <Wrench className="h-7 w-7 text-amber-600" />
          </div>
          <p className="text-center text-gray-700 text-sm leading-relaxed">
            Your <span className="font-semibold capitalize">{planDisplayName}</span> plan includes{' '}
            <span className="font-semibold">{techLimit} active technician{techLimit === 1 ? '' : 's'}</span>.{' '}
            Upgrade to <span className="font-semibold">Growth</span> for up to 20 technicians, or{' '}
            <span className="font-semibold">Business</span> for unlimited.
          </p>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setUpgradeModalOpen(false)}>
              Cancel
            </Button>
            <Link href="/dashboard/billing" className="flex-1">
              <Button className="w-full">
                Upgrade Plan <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  )
}
