'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serviceFieldSchema, type ServiceFieldInput } from '@/schemas'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input, Select, FormField, Modal, EmptyState, Badge, Spinner } from '@/components/ui'
import type { Service, ServiceField } from '@/types'
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Settings } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

const FIELD_TYPES = [
  { value: 'text', label: 'Text (single line)' },
  { value: 'textarea', label: 'Text Area (multi line)' },
  { value: 'number', label: 'Number' },
  { value: 'dropdown', label: 'Dropdown (select)' },
  { value: 'checkbox', label: 'Checkbox (yes/no)' },
  { value: 'date', label: 'Date' },
]

export default function ServiceTemplatesPage() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const preselectedServiceId = searchParams.get('service')

  const [services, setServices] = useState<Service[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedServiceId ?? '')
  const [fields, setFields] = useState<ServiceField[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingField, setEditingField] = useState<ServiceField | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [optionsText, setOptionsText] = useState('')

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ServiceFieldInput>({
    resolver: zodResolver(serviceFieldSchema),
  })

  const fieldType = watch('field_type')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchServices = useCallback(async () => {
    const { data } = await supabase.from('services').select('*').eq('is_active', true).order('sort_order')
    setServices(data ?? [])
    if (!selectedServiceId && data && data.length > 0) {
      setSelectedServiceId(preselectedServiceId ?? data[0].id)
    }
  }, [preselectedServiceId, selectedServiceId])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchFields = useCallback(async () => {
    if (!selectedServiceId) return
    setLoading(true)
    const { data } = await supabase
      .from('service_fields')
      .select('*')
      .eq('service_id', selectedServiceId)
      .order('sort_order')
    setFields(data ?? [])
    setLoading(false)
  }, [selectedServiceId])

  useEffect(() => { fetchServices() }, [fetchServices])
  useEffect(() => { fetchFields() }, [fetchFields])

  const openCreate = () => {
    setEditingField(null)
    reset({ field_label: '', field_key: '', field_type: 'text', is_required: false, sort_order: fields.length })
    setOptionsText('')
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (field: ServiceField) => {
    setEditingField(field)
    setValue('field_label', field.field_label)
    setValue('field_key', field.field_key)
    setValue('field_type', field.field_type)
    setValue('is_required', field.is_required)
    setValue('sort_order', field.sort_order)
    setOptionsText(Array.isArray(field.field_options) ? field.field_options.join('\n') : '')
    setError(null)
    setModalOpen(true)
  }

  const autoGenerateKey = (label: string) => {
    const key = label.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50)
    setValue('field_key', key)
  }

  const onSubmit = async (data: ServiceFieldInput) => {
    if (!selectedServiceId) return
    setSaveLoading(true)
    setError(null)

    const fieldOptions = data.field_type === 'dropdown'
      ? optionsText.split('\n').map(o => o.trim()).filter(Boolean)
      : null

    try {
      const payload = {
        ...data,
        service_id: selectedServiceId,
        field_options: fieldOptions,
      }

      if (editingField) {
        const { error } = await supabase.from('service_fields').update(payload).eq('id', editingField.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('service_fields').insert({ ...payload, sort_order: fields.length })
        if (error) throw error
      }
      setModalOpen(false)
      fetchFields()
    } catch (err: any) {
      setError(err.message ?? 'Failed to save field')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    await supabase.from('service_fields').delete().eq('id', id)
    setDeleteId(null)
    fetchFields()
  }

  const moveField = async (field: ServiceField, direction: 'up' | 'down') => {
    const idx = fields.findIndex(f => f.id === field.id)
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= fields.length) return
    const target = fields[targetIdx]
    await Promise.all([
      supabase.from('service_fields').update({ sort_order: target.sort_order }).eq('id', field.id),
      supabase.from('service_fields').update({ sort_order: field.sort_order }).eq('id', target.id),
    ])
    fetchFields()
  }

  const selectedService = services.find(s => s.id === selectedServiceId)

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Templates</h1>
          <p className="text-gray-500 text-sm mt-1">Define report fields for each service type</p>
        </div>
      </div>

      {/* Service Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex-shrink-0">Select Service:</label>
          <select
            value={selectedServiceId}
            onChange={e => setSelectedServiceId(e.target.value)}
            className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">-- Choose a service --</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.service_name}</option>
            ))}
          </select>
          {selectedServiceId && (
            <Button onClick={openCreate} size="sm">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Field
            </Button>
          )}
        </div>
      </div>

      {!selectedServiceId ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            icon={<Settings className="h-12 w-12" />}
            title="Select a service"
            description="Choose a service above to view and edit its report template fields."
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">{selectedService?.service_name} — Report Fields</h2>
              <p className="text-xs text-gray-400 mt-0.5">These fields appear in the technician's report form after the standard fields</p>
            </div>
            <span className="text-xs text-gray-400">{fields.length} custom field{fields.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : fields.length === 0 ? (
            <EmptyState
              icon={<Plus className="h-10 w-10" />}
              title="No custom fields yet"
              description="Add fields that technicians must fill when completing a report for this service."
              action={<Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add First Field</Button>}
            />
          ) : (
            <>
              {/* Fixed fields notice */}
              <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
                <p className="text-xs text-blue-700 font-medium">
                  Fixed fields (always included): Client Name, Contact Number, Email, Service Address, Service Type, Technician, Service Date, Start Time, End Time, Work Summary
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {fields.map((field, i) => (
                  <div key={field.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                    <div className="flex flex-col gap-1">
                      <button onClick={() => moveField(field, 'up')} disabled={i === 0} className="text-gray-300 hover:text-gray-500 disabled:opacity-20">
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => moveField(field, 'down')} disabled={i === fields.length - 1} className="text-gray-300 hover:text-gray-500 disabled:opacity-20">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 text-sm">{field.field_label}</p>
                        {field.is_required && <Badge variant="warning">Required</Badge>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Key: <code className="bg-gray-100 px-1 rounded">{field.field_key}</code>
                        {' · '}Type: {FIELD_TYPES.find(t => t.value === field.field_type)?.label ?? field.field_type}
                        {field.field_type === 'dropdown' && Array.isArray(field.field_options) &&
                          ` · Options: ${field.field_options.join(', ')}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(field)} className="p-1.5 text-gray-400 hover:text-[#1e3a5f]">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(field.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Create/Edit Field Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingField ? 'Edit Field' : 'Add Report Field'} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Field Label" required error={errors.field_label?.message}>
            <Input
              {...register('field_label')}
              placeholder="e.g. Chemical Used, Area Treated"
              error={errors.field_label?.message}
              onChange={e => {
                register('field_label').onChange(e)
                if (!editingField) autoGenerateKey(e.target.value)
              }}
            />
          </FormField>

          <FormField label="Field Key" required error={errors.field_key?.message} hint="Lowercase letters, numbers, underscores only. Auto-generated from label.">
            <Input {...register('field_key')} placeholder="e.g. chemical_used" error={errors.field_key?.message} />
          </FormField>

          <FormField label="Field Type" required error={errors.field_type?.message}>
            <Select {...register('field_type')}>
              {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </Select>
          </FormField>

          {fieldType === 'dropdown' && (
            <FormField label="Dropdown Options" required hint="One option per line">
              <textarea
                value={optionsText}
                onChange={e => setOptionsText(e.target.value)}
                placeholder={"Option 1\nOption 2\nOption 3"}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
              />
            </FormField>
          )}

          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_required" {...register('is_required')} className="h-4 w-4 rounded border-gray-300" />
            <label htmlFor="is_required" className="text-sm text-gray-700">Required field (technician must fill)</label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saveLoading} className="flex-1">
              {editingField ? 'Save Changes' : 'Add Field'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Field" size="sm">
        <p className="text-sm text-gray-600 mb-6">Delete this report field? Existing submitted values will remain in historical reports.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
          <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
