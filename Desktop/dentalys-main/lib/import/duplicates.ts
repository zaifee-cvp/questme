// lib/import/duplicates.ts
import type { AdminClient } from '@/lib/supabase/admin'
import type { ParsedCustomer, Customer } from '@/types'

export interface DuplicateCheck {
  record: ParsedCustomer
  existingCustomer: Customer
  matchType: 'phone' | 'email'
}

export async function findDuplicates(
  db: AdminClient,
  businessId: string,
  records: ParsedCustomer[]
): Promise<DuplicateCheck[]> {
  const { data: existingCustomers } = await db
    .from('customers')
    .select('*')
    .eq('business_id', businessId)

  if (!existingCustomers || existingCustomers.length === 0) return []

  const duplicates: DuplicateCheck[] = []

  for (const record of records) {
    // Match by phone (exact)
    if (record.phone) {
      const match = existingCustomers.find(
        (c) => c.phone === record.phone
      )
      if (match) {
        duplicates.push({
          record,
          existingCustomer: match,
          matchType: 'phone',
        })
        continue
      }
    }

    // Match by email (case-insensitive)
    if (record.email) {
      const match = existingCustomers.find(
        (c) => c.email?.toLowerCase() === record.email?.toLowerCase()
      )
      if (match) {
        duplicates.push({
          record,
          existingCustomer: match,
          matchType: 'email',
        })
      }
    }
  }

  return duplicates
}
