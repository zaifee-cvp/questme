// lib/supabase/admin.ts
// ONLY use in API routes — bypasses ALL RLS
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient<Database>(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-supabase-service-role': 'true',
        },
      },
    }
  )
}

export type AdminClient = ReturnType<typeof createAdminClient>
