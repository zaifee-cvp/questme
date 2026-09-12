alter table public.bots
  add column if not exists sales_mode boolean not null default false,
  add column if not exists sales_goal text,
  add column if not exists cta_label text,
  add column if not exists cta_url text,
  add column if not exists qualifying_questions text[] not null default '{}';

comment on column public.bots.sales_mode is
  'When true the assistant may ask one qualifying question and offer the configured CTA. Off by default so existing bots are unchanged.';
comment on column public.bots.cta_url is
  'The only URL the assistant may offer as a next step. It must never invent one.';
