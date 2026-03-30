# FieldService SaaS Platform — Setup & Deployment Guide

## Tech Stack
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth + Postgres + Storage) + Next.js API Routes
- **Email**: Resend
- **PDF**: @react-pdf/renderer (server-side)
- **QR Codes**: qrcode
- **Hosting**: Vercel

---

## 1. Supabase Project Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your `Project URL` and `anon public` key → add to `.env.local`
3. Copy your `service_role` key → add to `.env.local`

### Run Migrations
1. Go to **SQL Editor** in your Supabase dashboard
2. Paste and run: `supabase/migrations/001_initial_schema.sql`
3. This creates all tables, indexes, RLS policies, and functions

### Create Storage Bucket
In the Supabase dashboard → **Storage** → **New Bucket**:
- Name: `fieldsign-assets`
- Public: **No** (private)
- File size limit: 50MB
- Allowed MIME types: `image/jpeg, image/png, image/webp, application/pdf`

Then run the storage RLS policies from the bottom of the migration file (uncomment and run them in the SQL editor).

### Auth Configuration
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your production URL (or `http://localhost:3000` for dev)
3. Add redirect URL: `https://yourdomain.com/auth/callback`

---

## 2. Local Development Setup

```bash
# Clone and install dependencies
git clone <your-repo>
cd fieldservice-saas
npm install

# Set up environment variables
cp .env.local.example .env.local
# Fill in all values in .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign up for your first company account.

---

## 3. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Resend (email)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=FieldService Platform
```

---

## 4. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set production environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_APP_URL
vercel env add RESEND_API_KEY
vercel env add RESEND_FROM_EMAIL
vercel env add RESEND_FROM_NAME

# Deploy to production
vercel --prod
```

After deployment:
1. Update `NEXT_PUBLIC_APP_URL` to your Vercel production URL
2. Update Supabase Auth redirect URLs to include your Vercel domain

---

## 5. First-Time Setup (After Deployment)

1. **Sign up** at `/auth/signup` — creates your company account
2. Go to **Settings** `/dashboard/settings` — add your company info and logo
3. Go to **Services** `/dashboard/services` — create your service types
4. Go to **Service Templates** `/dashboard/service-templates` — add report fields per service
5. Go to **Technicians** `/dashboard/technicians` — add your technicians
6. Go to **QR Codes** `/dashboard/qrcodes` — generate QR codes for each technician
7. Print/share QR codes with technicians
8. Technicians scan QR → access `/tech` → see assigned SWOs + create reports

---

## 6. Application Architecture

### User Flows

**Admin Flow:**
1. Admin logs in → `/dashboard`
2. Creates clients, services, templates, technicians
3. Generates QR codes for technicians
4. Creates SWOs and assigns to technicians
5. Views completed reports → downloads PDFs → resends emails

**Technician Flow:**
1. Technician scans QR code → lands on `/tech`
2. QR token validated against `qr_codes` table
3. Technician sees assigned SWOs
4. Opens SWO → taps "Start Service Report"
5. Fills multi-step report form (client → service → form → signature)
6. Submits → PDF generated + emailed automatically

### Security Model
- **Multi-tenancy**: Every table has `company_id` + RLS policies
- **Admin routes**: Protected by middleware checking `profiles.role = 'admin'`
- **Technician access**: QR token validates via `validate_qr_token()` DB function
- **Service role**: Only used in secure server-side API routes
- **Storage**: Tenant-scoped paths `companies/{company_id}/...`

---

## 7. Key File Structure

```
src/
├── app/
│   ├── auth/           # Login, Signup, Callback
│   ├── dashboard/      # Admin pages (clients, SWOs, reports, settings, etc.)
│   ├── tech/           # Technician mobile app
│   └── api/            # API route handlers
├── components/
│   ├── ui/             # Shared UI components
│   ├── admin/          # Admin-specific components
│   └── tech/           # Technician-specific components
├── contexts/           # React contexts (TechContext)
├── hooks/              # Custom hooks (useTimer)
├── lib/
│   ├── supabase/       # Client, server, middleware utilities
│   ├── pdf/            # PDF generation
│   ├── email/          # Resend email service
│   ├── qr/             # QR code generation
│   └── utils/          # Formatters, helpers
├── schemas/            # Zod validation schemas
└── types/              # TypeScript types
supabase/
└── migrations/         # SQL schema, RLS, indexes, functions
```

---

## 8. Key Database Functions

| Function | Purpose |
|----------|---------|
| `generate_swo_number(company_id)` | Atomic, race-safe SWO number generation |
| `generate_report_number(company_id)` | Atomic, race-safe report number generation |
| `validate_qr_token(token)` | Validates QR token, returns technician + company info |
| `get_user_company_id()` | Helper used in RLS policies |
| `get_user_role()` | Helper used in RLS policies |

---

## 9. Adding More Tenants

The platform is fully multi-tenant. Each company that signs up via `/auth/signup` gets:
- Isolated `companies` record
- All RLS policies automatically applied
- Own QR token namespace
- Own SWO/Report number sequences (with their own prefixes)

---

## 10. Resend Email Setup

1. Create account at [resend.com](https://resend.com)
2. Add and verify your sending domain
3. Create API key → add to `RESEND_API_KEY`
4. Set `RESEND_FROM_EMAIL` to a verified address on your domain

---

## 11. Production Checklist

- [ ] Supabase project created and migration run
- [ ] Storage bucket `fieldsign-assets` created with RLS policies
- [ ] Supabase Auth redirect URLs configured
- [ ] All environment variables set in Vercel
- [ ] Resend domain verified
- [ ] Company signed up and settings configured
- [ ] Services and templates created
- [ ] Technicians added and QR codes generated
- [ ] End-to-end test: Create SWO → Tech submits report → Check PDF + email
