-- supabase/migrations/20260320_production_upgrade.sql
-- Production-grade infrastructure upgrade:
--   • app_events audit/analytics table
--   • businesses: alert_notifications_enabled, alert_owner_chat_id
--   • bookings: soft-delete support (deleted_at)
--   • Extra indexes for plan usage queries
--   • RLS policies for new columns/tables

-- ============================================================
-- TABLE: app_events (audit log / analytics)
-- ============================================================
create table if not exists public.app_events (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid references public.businesses(id) on delete cascade,
  user_id      uuid references auth.users(id) on delete set null,
  event_type   text not null,
  event_data   jsonb not null default '{}',
  ip_address   text,
  user_agent   text,
  created_at   timestamptz not null default now()
);

create index if not exists idx_app_events_business_id
  on public.app_events(business_id);
create index if not exists idx_app_events_event_type
  on public.app_events(event_type);
create index if not exists idx_app_events_created_at
  on public.app_events(created_at desc);

-- RLS: businesses can read their own events; only service role can insert
alter table public.app_events enable row level security;

create policy "Business owners can read own events"
  on public.app_events for select
  using (
    business_id in (
      select business_id from public.profiles where id = auth.uid()
    )
  );

-- ============================================================
-- COLUMN ADDITIONS: businesses
-- ============================================================

-- Allow business owners to enable Telegram notifications for new bookings
alter table public.businesses
  add column if not exists alert_notifications_enabled boolean not null default false;

-- The Telegram chat ID where booking alerts are sent (owner's personal chat)
alter table public.businesses
  add column if not exists alert_owner_chat_id text;

-- ============================================================
-- COLUMN ADDITIONS: bookings (soft-delete support)
-- ============================================================
alter table public.bookings
  add column if not exists deleted_at timestamptz;

create index if not exists idx_bookings_deleted_at
  on public.bookings(deleted_at)
  where deleted_at is null;

-- ============================================================
-- EXTRA INDEXES for usage queries
-- ============================================================

-- Speed up monthly booking counts by business
create index if not exists idx_bookings_business_created
  on public.bookings(business_id, created_at desc)
  where deleted_at is null;

-- Speed up monthly conversation counts by business
create index if not exists idx_conv_threads_business_created
  on public.conversation_threads(business_id, created_at desc);

-- Speed up active customer counts
create index if not exists idx_customers_business_created
  on public.customers(business_id, created_at desc);
