'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientSchema, type ClientInput } from '@/schemas'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Input, Textarea, FormField, Badge, Modal, EmptyState,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Spinner
} from '@/components/ui'
import type { Client } from '@/types'
import { formatDate } from '@/lib/utils/formatters'
import { Plus, Search, Edit2, Trash2, Users } from 'lucide-react'

export default function ClientsPage() {
  const supabase = createClient()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchClients = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('client_name', { ascending: true })
    setClients(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchClients() }, [fetchClients])

  const openCreate = () => {
    setEditingClient(null)
    reset({})
    setError(null)
    setModalOpen(true)
  }

  const openEdit = (client: Client) => {
    setEditingClient(client)
    setValue('client_name', client.client_name)
    setValue('contact_person', client.contact_person ?? '')
    setValue('contact_number', client.contact_number ?? '')
    setValue('email', client.email ?? '')
    setValue('address', client.address ?? '')
    setValue('notes', client.notes ?? '')
    setError(null)
    setModalOpen(true)
  }

  const onSubmit = async (data: ClientInput) => {
    setSaveLoading(true)
    setError(null)
    try {
      const cleanData = {
        client_name: data.client_name,
        contact_person: data.contact_person || null,
        contact_number: data.contact_number || null,
        email: data.email || null,
        address: data.address || null,
        notes: data.notes || null,
      }

      if (editingClient) {
        const { error } = await supabase.from('clients').update(cleanData).eq('id', editingClient.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('clients').insert(cleanData)
        if (error) throw error
      }

      setModalOpen(false)
      fetchClients()
    } catch (err: any) {
      setError(err.message ?? 'Failed to save client')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleteLoading(true)
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (!error) {
      setDeleteId(null)
      fetchClients()
    }
    setDeleteLoading(false)
  }

  const filtered = clients.filter(c =>
    c.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.contact_number ?? '').includes(searchQuery) ||
    (c.email ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">{clients.length} total clients</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, phone, or email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title={searchQuery ? 'No clients found' : 'No clients yet'}
            description={searchQuery ? 'Try a different search term.' : 'Add your first client to get started.'}
            action={!searchQuery ? <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add Client</Button> : undefined}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(client => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium text-gray-900">{client.client_name}</TableCell>
                  <TableCell className="text-gray-600">{client.contact_person ?? '-'}</TableCell>
                  <TableCell className="text-gray-600">{client.contact_number ?? '-'}</TableCell>
                  <TableCell className="text-gray-600">{client.email ?? '-'}</TableCell>
                  <TableCell className="text-gray-600 max-w-[200px] truncate">{client.address ?? '-'}</TableCell>
                  <TableCell className="text-gray-500 text-xs">{formatDate(client.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(client)} className="p-1.5 text-gray-400 hover:text-[#1e3a5f] transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(client.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Client Name" required error={errors.client_name?.message}>
            <Input {...register('client_name')} placeholder="ABC Corporation" error={errors.client_name?.message} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Contact Person" error={errors.contact_person?.message}>
              <Input {...register('contact_person')} placeholder="John Smith" />
            </FormField>
            <FormField label="Contact Number" error={errors.contact_number?.message}>
              <Input {...register('contact_number')} placeholder="+65 9123 4567" />
            </FormField>
          </div>
          <FormField label="Email" error={errors.email?.message}>
            <Input type="email" {...register('email')} placeholder="contact@company.com" />
          </FormField>
          <FormField label="Address" error={errors.address?.message}>
            <Textarea {...register('address')} placeholder="123 Main Street, Singapore 123456" rows={2} />
          </FormField>
          <FormField label="Notes" error={errors.notes?.message}>
            <Textarea {...register('notes')} placeholder="Any special notes about this client..." rows={2} />
          </FormField>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saveLoading} className="flex-1">
              {editingClient ? 'Save Changes' : 'Add Client'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Client" size="sm">
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this client? This action cannot be undone.
          Associated work orders and reports will remain but be unlinked.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancel</Button>
          <Button
            variant="destructive"
            loading={deleteLoading}
            onClick={() => deleteId && handleDelete(deleteId)}
            className="flex-1"
          >
            Delete Client
          </Button>
        </div>
      </Modal>
    </div>
  )
}
