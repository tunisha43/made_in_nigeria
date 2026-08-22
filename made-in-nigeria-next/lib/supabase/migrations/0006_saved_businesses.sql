-- Made in Nigeria — saved_businesses table
-- Run this once in Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Depends on 0001_init.sql having already been run.

create table if not exists public.saved_businesses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, business_id)
);

alter table public.saved_businesses enable row level security;

drop policy if exists "Customers manage their own saved businesses" on public.saved_businesses;
create policy "Customers manage their own saved businesses"
  on public.saved_businesses for all
  using (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

create index if not exists idx_saved_businesses_customer on public.saved_businesses(customer_id);
create index if not exists idx_saved_businesses_business on public.saved_businesses(business_id);
