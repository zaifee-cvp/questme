# FieldService Pro — Claude Code Instructions

## Project Overview
Multi-tenant Field Service Work Order and Report SaaS platform.
Built with: Next.js 15 App Router + TypeScript + Tailwind CSS + Supabase + Resend + @react-pdf/renderer

## Setup Steps (run in order)
1. `npm install`
2. Fill in `.env.local` with your Supabase and Resend credentials
3. Run the SQL migration in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor
4. Create a Supabase Storage bucket named `fieldsign-assets` (private, 50MB limit)
5. `npm run dev`

## Architecture
- `/src/app/dashboard/*` — Admin pages (requires auth + admin role)
- `/src/app/tech/*` — Technician mobile app (QR token auth, no login required)
- `/src/app/api/*` — API route handlers
- `/src/lib/supabase/` — client.ts (browser), server.ts (server + service role)
- `/src/lib/pdf/` — PDF generation with @react-pdf/renderer
- `/src/lib/email/` — Resend email service
- `/src/lib/qr/` — QR code generation
- `/src/types/index.ts` — All TypeScript interfaces
- `/src/schemas/index.ts` — All Zod validation schemas

## Key Patterns
- All tenant data has `company_id` — enforced by Supabase RLS
- Service role client (`createServiceClient()`) used ONLY in API routes
- Browser client (`createClient()`) used in 'use client' components
- Server client (`createServerSupabaseClient()`) used in Server Components
- QR token validates via `validate_qr_token()` Postgres function
- SWO/Report numbers generated via `generate_swo_number()` / `generate_report_number()` Postgres functions (race-safe)

## User Roles
- `admin` — accesses /dashboard, created via /auth/signup
- `technician` — accesses /tech via QR code scan only

## Common Commands
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run type-check   # TypeScript check only
```

## Environment Variables Required
See `.env.local` — fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, 
SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, RESEND_FROM_EMAIL
