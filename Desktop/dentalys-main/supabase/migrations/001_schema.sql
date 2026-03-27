-- supabase/migrations/001_schema.sql

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "pg_trgm" with schema extensions;
create extension if not exists "btree_gist" with schema extensions;

-- ============================================================
-- TABLE: businesses
-- ============================================================
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text unique not null,
  tagline text,
  phone text,
  email text,
  address text,
  website text,
  logo_url text,
  timezone text not null default 'UTC',
  currency text not null default 'USD',
  language text not null default 'en',
  country text,
  telegram_bot_token text,
  telegram_bot_username text,
  telegram_webhook_secret text default encode(extensions.gen_random_bytes(32), 'hex'),
  whatsapp_provider text check (whatsapp_provider in ('wati','twilio','360dialog')),
  whatsapp_phone_number text,
  whatsapp_display_name text,
  whatsapp_api_url text,
  whatsapp_api_token text,
  whatsapp_webhook_secret text default encode(extensions.gen_random_bytes(32), 'hex'),
  whatsapp_enabled boolean not null default false,
  welcome_message text not null default 'Hi! 👋 Welcome to {{clinic_name}}!',
  handoff_message text not null default 'Connecting you with our team now 🙏',
  setup_progress jsonb not null default '{}',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_businesses_owner_id on public.businesses(owner_id);
create index idx_businesses_slug on public.businesses(slug);

-- ============================================================
-- TABLE: profiles
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete set null,
  full_name text,
  avatar_url text,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_business_id on public.profiles(business_id);

-- ============================================================
-- TABLE: subscriptions
-- ============================================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid unique not null references public.businesses(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_price_id text,
  plan text not null default 'free' check (plan in ('free','starter','pro')),
  status text not null default 'trialing' check (status in ('trialing','active','past_due','canceled','incomplete')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  trial_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_subscriptions_business_id on public.subscriptions(business_id);

-- ============================================================
-- TABLE: services
-- ============================================================
create table public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  price numeric(10,2) check (price >= 0),
  currency text not null default 'USD',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_services_business_id on public.services(business_id);

-- ============================================================
-- TABLE: promotions
-- ============================================================
create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null,
  description text,
  discount_type text not null default 'percentage' check (discount_type in ('percentage','fixed')),
  discount_value numeric(10,2) not null check (discount_value > 0),
  applicable_service_ids uuid[],
  first_time_only boolean not null default true,
  valid_from timestamptz,
  valid_until timestamptz,
  promo_code text,
  max_redemptions integer,
  redemption_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_promotions_business_id on public.promotions(business_id);

-- ============================================================
-- TABLE: business_hours
-- ============================================================
create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  day_of_week integer not null check (day_of_week >= 0 and day_of_week <= 6),
  open_time time not null,
  close_time time not null,
  is_open boolean not null default true,
  created_at timestamptz not null default now(),
  unique (business_id, day_of_week)
);

create index idx_business_hours_business_id on public.business_hours(business_id);

-- ============================================================
-- TABLE: customers
-- ============================================================
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  telegram_chat_id text,
  whatsapp_phone text,
  name text,
  phone text,
  email text,
  notes text,
  is_first_time boolean not null default true,
  tags text[],
  import_source text not null default 'telegram'
    check (import_source in ('telegram','whatsapp','manual','csv','xlsx','vcf','json')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, telegram_chat_id)
);

create index idx_customers_business_id on public.customers(business_id);
create index idx_customers_telegram_chat_id on public.customers(telegram_chat_id);
create index idx_customers_whatsapp_phone on public.customers(whatsapp_phone);

-- ============================================================
-- TABLE: bookings
-- ============================================================
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  service_name text,
  service_duration integer,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'confirmed'
    check (status in ('pending','confirmed','cancelled','completed','no_show')),
  notes text,
  promotion_id uuid references public.promotions(id) on delete set null,
  google_event_id text,
  google_calendar_id text,
  booking_channel text not null default 'telegram'
    check (booking_channel in ('telegram','whatsapp','manual')),
  reminder_24h_sent boolean not null default false,
  reminder_1h_sent boolean not null default false,
  source text not null default 'telegram'
    check (source in ('telegram','whatsapp','manual','api')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  exclude using gist (
    business_id with =,
    tstzrange(start_time, end_time, '[)') with &&
  ) where (status not in ('cancelled'))
);

create index idx_bookings_business_id on public.bookings(business_id);
create index idx_bookings_customer_id on public.bookings(customer_id);
create index idx_bookings_service_id on public.bookings(service_id);
create index idx_bookings_start_time on public.bookings(start_time);
create index idx_bookings_status on public.bookings(status);

-- ============================================================
-- TABLE: faq_items
-- ============================================================
create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  question text not null,
  answer text not null,
  tags text[],
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_faq_items_business_id on public.faq_items(business_id);
create index idx_faq_items_fulltext on public.faq_items
  using gin(to_tsvector('english', question || ' ' || answer));

-- ============================================================
-- TABLE: conversation_threads
-- ============================================================
create table public.conversation_threads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  telegram_chat_id text,
  channel text not null default 'telegram' check (channel in ('telegram','whatsapp')),
  status text not null default 'active' check (status in ('active','handed_off','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, telegram_chat_id, channel)
);

create index idx_conversation_threads_business_id on public.conversation_threads(business_id);
create index idx_conversation_threads_customer_id on public.conversation_threads(customer_id);

-- ============================================================
-- TABLE: conversation_logs
-- ============================================================
create table public.conversation_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  thread_id uuid not null references public.conversation_threads(id) on delete cascade,
  role text not null check (role in ('user','assistant','tool')),
  content text not null,
  tool_name text,
  tool_call_id text,
  created_at timestamptz not null default now()
);

create index idx_conversation_logs_business_id on public.conversation_logs(business_id);
create index idx_conversation_logs_thread_id on public.conversation_logs(thread_id);

-- ============================================================
-- TABLE: handoff_requests
-- ============================================================
create table public.handoff_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  thread_id uuid not null references public.conversation_threads(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  reason text,
  status text not null default 'pending'
    check (status in ('pending','acknowledged','resolved')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_handoff_requests_business_id on public.handoff_requests(business_id);
create index idx_handoff_requests_thread_id on public.handoff_requests(thread_id);
create index idx_handoff_requests_status on public.handoff_requests(status);

-- ============================================================
-- TABLE: calendar_connections
-- ============================================================
create table public.calendar_connections (
  id uuid primary key default gen_random_uuid(),
  business_id uuid unique not null references public.businesses(id) on delete cascade,
  google_account_email text,
  calendar_id text not null default 'primary',
  access_token text,
  refresh_token text,
  token_expiry timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_calendar_connections_business_id on public.calendar_connections(business_id);

-- ============================================================
-- TABLE: customer_imports
-- ============================================================
create table public.customer_imports (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  file_name text,
  file_format text check (file_format in ('csv','xlsx','vcf','json')),
  total_rows integer not null default 0,
  imported_count integer not null default 0,
  skipped_count integer not null default 0,
  error_count integer not null default 0,
  status text not null default 'pending'
    check (status in ('pending','processing','completed','failed')),
  error_log jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_customer_imports_business_id on public.customer_imports(business_id);

-- ============================================================
-- TABLE: whatsapp_templates
-- ============================================================
create table public.whatsapp_templates (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  template_name text not null,
  template_body text not null,
  variables text[],
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  provider_template_id text,
  created_at timestamptz not null default now(),
  unique (business_id, template_name)
);

create index idx_whatsapp_templates_business_id on public.whatsapp_templates(business_id);

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
alter table public.businesses enable row level security;
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.services enable row level security;
alter table public.promotions enable row level security;
alter table public.business_hours enable row level security;
alter table public.customers enable row level security;
alter table public.bookings enable row level security;
alter table public.faq_items enable row level security;
alter table public.conversation_threads enable row level security;
alter table public.conversation_logs enable row level security;
alter table public.handoff_requests enable row level security;
alter table public.calendar_connections enable row level security;
alter table public.customer_imports enable row level security;
alter table public.whatsapp_templates enable row level security;

-- ============================================================
-- Helper function: my_business_id()
-- ============================================================
create or replace function public.my_business_id()
returns uuid
language sql stable security definer
as $$
  select business_id from public.profiles where id = auth.uid()
$$;

-- ============================================================
-- RLS Policies: businesses (owner_id = auth.uid())
-- ============================================================
create policy "businesses_select" on public.businesses
  for select using (owner_id = auth.uid());
create policy "businesses_insert" on public.businesses
  for insert with check (owner_id = auth.uid());
create policy "businesses_update" on public.businesses
  for update using (owner_id = auth.uid());
create policy "businesses_delete" on public.businesses
  for delete using (owner_id = auth.uid());

-- ============================================================
-- RLS Policies: profiles
-- ============================================================
create policy "profiles_select" on public.profiles
  for select using (id = auth.uid());
create policy "profiles_insert" on public.profiles
  for insert with check (id = auth.uid());
create policy "profiles_update" on public.profiles
  for update using (id = auth.uid());

-- ============================================================
-- RLS Policies: all other tables (business_id = my_business_id())
-- ============================================================
-- subscriptions
create policy "subscriptions_select" on public.subscriptions
  for select using (business_id = public.my_business_id());
create policy "subscriptions_insert" on public.subscriptions
  for insert with check (business_id = public.my_business_id());
create policy "subscriptions_update" on public.subscriptions
  for update using (business_id = public.my_business_id());
create policy "subscriptions_delete" on public.subscriptions
  for delete using (business_id = public.my_business_id());

-- services
create policy "services_select" on public.services
  for select using (business_id = public.my_business_id());
create policy "services_insert" on public.services
  for insert with check (business_id = public.my_business_id());
create policy "services_update" on public.services
  for update using (business_id = public.my_business_id());
create policy "services_delete" on public.services
  for delete using (business_id = public.my_business_id());

-- promotions
create policy "promotions_select" on public.promotions
  for select using (business_id = public.my_business_id());
create policy "promotions_insert" on public.promotions
  for insert with check (business_id = public.my_business_id());
create policy "promotions_update" on public.promotions
  for update using (business_id = public.my_business_id());
create policy "promotions_delete" on public.promotions
  for delete using (business_id = public.my_business_id());

-- business_hours
create policy "business_hours_select" on public.business_hours
  for select using (business_id = public.my_business_id());
create policy "business_hours_insert" on public.business_hours
  for insert with check (business_id = public.my_business_id());
create policy "business_hours_update" on public.business_hours
  for update using (business_id = public.my_business_id());
create policy "business_hours_delete" on public.business_hours
  for delete using (business_id = public.my_business_id());

-- customers
create policy "customers_select" on public.customers
  for select using (business_id = public.my_business_id());
create policy "customers_insert" on public.customers
  for insert with check (business_id = public.my_business_id());
create policy "customers_update" on public.customers
  for update using (business_id = public.my_business_id());
create policy "customers_delete" on public.customers
  for delete using (business_id = public.my_business_id());

-- bookings
create policy "bookings_select" on public.bookings
  for select using (business_id = public.my_business_id());
create policy "bookings_insert" on public.bookings
  for insert with check (business_id = public.my_business_id());
create policy "bookings_update" on public.bookings
  for update using (business_id = public.my_business_id());
create policy "bookings_delete" on public.bookings
  for delete using (business_id = public.my_business_id());

-- faq_items
create policy "faq_items_select" on public.faq_items
  for select using (business_id = public.my_business_id());
create policy "faq_items_insert" on public.faq_items
  for insert with check (business_id = public.my_business_id());
create policy "faq_items_update" on public.faq_items
  for update using (business_id = public.my_business_id());
create policy "faq_items_delete" on public.faq_items
  for delete using (business_id = public.my_business_id());

-- conversation_threads
create policy "conversation_threads_select" on public.conversation_threads
  for select using (business_id = public.my_business_id());
create policy "conversation_threads_insert" on public.conversation_threads
  for insert with check (business_id = public.my_business_id());
create policy "conversation_threads_update" on public.conversation_threads
  for update using (business_id = public.my_business_id());
create policy "conversation_threads_delete" on public.conversation_threads
  for delete using (business_id = public.my_business_id());

-- conversation_logs
create policy "conversation_logs_select" on public.conversation_logs
  for select using (business_id = public.my_business_id());
create policy "conversation_logs_insert" on public.conversation_logs
  for insert with check (business_id = public.my_business_id());
create policy "conversation_logs_update" on public.conversation_logs
  for update using (business_id = public.my_business_id());
create policy "conversation_logs_delete" on public.conversation_logs
  for delete using (business_id = public.my_business_id());

-- handoff_requests
create policy "handoff_requests_select" on public.handoff_requests
  for select using (business_id = public.my_business_id());
create policy "handoff_requests_insert" on public.handoff_requests
  for insert with check (business_id = public.my_business_id());
create policy "handoff_requests_update" on public.handoff_requests
  for update using (business_id = public.my_business_id());
create policy "handoff_requests_delete" on public.handoff_requests
  for delete using (business_id = public.my_business_id());

-- calendar_connections
create policy "calendar_connections_select" on public.calendar_connections
  for select using (business_id = public.my_business_id());
create policy "calendar_connections_insert" on public.calendar_connections
  for insert with check (business_id = public.my_business_id());
create policy "calendar_connections_update" on public.calendar_connections
  for update using (business_id = public.my_business_id());
create policy "calendar_connections_delete" on public.calendar_connections
  for delete using (business_id = public.my_business_id());

-- customer_imports
create policy "customer_imports_select" on public.customer_imports
  for select using (business_id = public.my_business_id());
create policy "customer_imports_insert" on public.customer_imports
  for insert with check (business_id = public.my_business_id());
create policy "customer_imports_update" on public.customer_imports
  for update using (business_id = public.my_business_id());
create policy "customer_imports_delete" on public.customer_imports
  for delete using (business_id = public.my_business_id());

-- whatsapp_templates
create policy "whatsapp_templates_select" on public.whatsapp_templates
  for select using (business_id = public.my_business_id());
create policy "whatsapp_templates_insert" on public.whatsapp_templates
  for insert with check (business_id = public.my_business_id());
create policy "whatsapp_templates_update" on public.whatsapp_templates
  for update using (business_id = public.my_business_id());
create policy "whatsapp_templates_delete" on public.whatsapp_templates
  for delete using (business_id = public.my_business_id());

-- ============================================================
-- Service-role bypass policies (all 15 tables)
-- ============================================================
create policy "service_role_businesses" on public.businesses
  for all to service_role using (true) with check (true);
create policy "service_role_profiles" on public.profiles
  for all to service_role using (true) with check (true);
create policy "service_role_subscriptions" on public.subscriptions
  for all to service_role using (true) with check (true);
create policy "service_role_services" on public.services
  for all to service_role using (true) with check (true);
create policy "service_role_promotions" on public.promotions
  for all to service_role using (true) with check (true);
create policy "service_role_business_hours" on public.business_hours
  for all to service_role using (true) with check (true);
create policy "service_role_customers" on public.customers
  for all to service_role using (true) with check (true);
create policy "service_role_bookings" on public.bookings
  for all to service_role using (true) with check (true);
create policy "service_role_faq_items" on public.faq_items
  for all to service_role using (true) with check (true);
create policy "service_role_conversation_threads" on public.conversation_threads
  for all to service_role using (true) with check (true);
create policy "service_role_conversation_logs" on public.conversation_logs
  for all to service_role using (true) with check (true);
create policy "service_role_handoff_requests" on public.handoff_requests
  for all to service_role using (true) with check (true);
create policy "service_role_calendar_connections" on public.calendar_connections
  for all to service_role using (true) with check (true);
create policy "service_role_customer_imports" on public.customer_imports
  for all to service_role using (true) with check (true);
create policy "service_role_whatsapp_templates" on public.whatsapp_templates
  for all to service_role using (true) with check (true);

-- ============================================================
-- Trigger: set_updated_at
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.businesses
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.services
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.promotions
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.customers
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.faq_items
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.conversation_threads
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.handoff_requests
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.calendar_connections
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.customer_imports
  for each row execute function public.set_updated_at();

-- ============================================================
-- Trigger: handle_new_user
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Function: seed_default_hours
-- ============================================================
create or replace function public.seed_default_hours(p_business_id uuid)
returns void
language plpgsql
as $$
begin
  -- Monday (1) to Friday (5): 10:00-19:00 open
  insert into public.business_hours (business_id, day_of_week, open_time, close_time, is_open)
  values
    (p_business_id, 1, '10:00', '19:00', true),
    (p_business_id, 2, '10:00', '19:00', true),
    (p_business_id, 3, '10:00', '19:00', true),
    (p_business_id, 4, '10:00', '19:00', true),
    (p_business_id, 5, '10:00', '19:00', true),
    -- Saturday (6): 10:00-18:00 open
    (p_business_id, 6, '10:00', '18:00', true),
    -- Sunday (0): closed
    (p_business_id, 0, '10:00', '18:00', false)
  on conflict do nothing;
end;
$$;

-- ============================================================
-- Function: seed_business_templates
-- ============================================================
create or replace function public.seed_business_templates(p_business_id uuid)
returns void
language plpgsql
as $$
begin
  -- Seed default hours
  perform public.seed_default_hours(p_business_id);

  -- Seed 5 default services
  insert into public.services (business_id, name, description, duration_minutes, price, currency, sort_order)
  values
    (p_business_id, 'Botox Treatment', 'Smooth fine lines and wrinkles with precision Botox injections administered by our certified specialists.', 45, 350.00, 'USD', 1),
    (p_business_id, 'Dermal Fillers', 'Restore volume and contour with premium hyaluronic acid fillers for natural-looking enhancement.', 60, 580.00, 'USD', 2),
    (p_business_id, 'Laser Skin Rejuvenation', 'Advanced laser therapy to improve skin texture, tone, and reduce signs of aging.', 60, 280.00, 'USD', 3),
    (p_business_id, 'HydraFacial', 'Deep-cleansing, hydrating facial treatment that delivers instant glow and long-lasting results.', 75, 188.00, 'USD', 4),
    (p_business_id, 'Consultation', 'Comprehensive one-on-one consultation to discuss your dental health goals and create a personalized treatment plan.', 30, 50.00, 'USD', 5)
  on conflict do nothing;

  -- Seed 10 FAQ items
  insert into public.faq_items (business_id, question, answer, tags, sort_order)
  values
    (p_business_id,
     'Are the treatments safe?',
     'Yes! All our treatments are FDA-approved and performed by certified medical professionals with years of experience. We use only premium, clinically-tested products and follow strict safety protocols.',
     array['safety','general'], 1),
    (p_business_id,
     'How long do treatments take?',
     'Treatment duration varies: Botox takes about 45 minutes, Dermal Fillers around 60 minutes, Laser Rejuvenation 60 minutes, and HydraFacial about 75 minutes. A consultation is approximately 30 minutes.',
     array['duration','general'], 2),
    (p_business_id,
     'Is there any pain during treatment?',
     'Most treatments involve minimal discomfort. We use topical numbing cream before injections, and many patients describe the sensation as a small pinch. Laser treatments may feel like a slight warming sensation.',
     array['pain','comfort'], 3),
    (p_business_id,
     'What is the downtime after treatment?',
     'Downtime varies by treatment. Botox and fillers have minimal downtime — you can return to normal activities immediately. Laser treatments may have 1-2 days of mild redness. We will provide detailed aftercare instructions.',
     array['downtime','recovery'], 4),
    (p_business_id,
     'How should I prepare for my appointment?',
     'Avoid blood-thinning medications (aspirin, ibuprofen) and alcohol for 24-48 hours before treatment. Come with clean skin free of makeup. Stay hydrated and let us know about any allergies or medical conditions.',
     array['preparation','pre-treatment'], 5),
    (p_business_id,
     'What is your cancellation policy?',
     'We require at least 24 hours notice for cancellations or rescheduling. Late cancellations or no-shows may be subject to a fee. Please contact us as early as possible if you need to change your appointment.',
     array['cancellation','policy'], 6),
    (p_business_id,
     'Do you offer package deals or promotions?',
     'Yes! We regularly offer promotions and package deals. First-time visitors enjoy a special 15% discount with code WELCOME15. Ask our team about current multi-treatment packages for additional savings.',
     array['packages','promotions','pricing'], 7),
    (p_business_id,
     'How do I know which treatment is right for me?',
     'We recommend starting with a consultation where our specialists assess your skin and discuss your goals. We will create a personalized treatment plan tailored to your needs, skin type, and desired outcomes.',
     array['consultation','treatment-selection'], 8),
    (p_business_id,
     'What are the qualifications of your doctors?',
     'Our dental team consists of board-certified dentists and dental specialists with extensive training and years of experience in dental procedures. All practitioners maintain current certifications and attend regular advanced training.',
     array['credentials','doctors','qualifications'], 9),
    (p_business_id,
     'Where are you located and what are your hours?',
     'You can find our address and operating hours on our profile. We are generally open Monday-Friday 10 AM to 7 PM, Saturday 10 AM to 6 PM, and closed on Sunday. Feel free to book an appointment at your convenience!',
     array['location','hours','contact'], 10)
  on conflict do nothing;

  -- Seed default promotion
  insert into public.promotions (business_id, title, description, discount_type, discount_value, promo_code, first_time_only, is_active)
  values (
    p_business_id,
    'First Visit Special',
    'Welcome! Enjoy 15% off your first treatment with us.',
    'percentage',
    15,
    'WELCOME15',
    true,
    true
  )
  on conflict do nothing;
end;
$$;

-- ============================================================
-- Trigger: handle_new_business
-- ============================================================
create or replace function public.handle_new_business()
returns trigger
language plpgsql security definer
as $$
begin
  -- Create free subscription with 14-day trial
  insert into public.subscriptions (business_id, plan, status, trial_end)
  values (new.id, 'free', 'trialing', now() + interval '14 days');

  -- Seed default templates
  perform public.seed_business_templates(new.id);

  return new;
end;
$$;

create trigger on_business_created
  after insert on public.businesses
  for each row execute function public.handle_new_business();
