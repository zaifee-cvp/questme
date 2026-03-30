import { NextRequest, NextResponse } from 'next/server'
import { signupSchema } from '@/schemas'
import { createServiceClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils/formatters'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 })
    }

    const { company_name, name, email, password } = parsed.data
    const serviceClient = createServiceClient()

    // 1. Create auth user first
    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for now; can require email verification later
      user_metadata: { name },
    })

    if (authError || !authData.user) {
      return NextResponse.json({ success: false, error: authError?.message ?? 'Failed to create user' }, { status: 400 })
    }

    const userId = authData.user.id

    // 2. Create company
    const slug = generateSlug(company_name) + '-' + Date.now().toString(36)

    const { data: company, error: companyError } = await serviceClient
      .from('companies')
      .insert({
        company_name,
        company_slug: slug,
        company_email: email,
      })
      .select()
      .single()

    if (companyError || !company) {
      // Rollback: delete the auth user
      await serviceClient.auth.admin.deleteUser(userId)
      return NextResponse.json({ success: false, error: 'Failed to create company' }, { status: 500 })
    }

    // 3. Create profile
    const { error: profileError } = await serviceClient
      .from('profiles')
      .insert({
        id: userId,
        company_id: company.id,
        role: 'admin',
        name,
        email,
      })

    if (profileError) {
      // Rollback both
      await serviceClient.auth.admin.deleteUser(userId)
      await serviceClient.from('companies').delete().eq('id', company.id)
      return NextResponse.json({ success: false, error: 'Failed to create profile' }, { status: 500 })
    }

    // 4. Sign in the user to set session cookie
    // We need to sign in via the anon client to get session cookies
    // Return success and let client sign in
    return NextResponse.json({ success: true, data: { companyId: company.id } })

  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
