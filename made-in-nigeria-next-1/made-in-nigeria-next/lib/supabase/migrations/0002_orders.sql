-- Made in Nigeria — orders table
-- Run this once in Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Depends on 0001_init.sql having already been run.
--
-- NOTE: nothing writes to this table yet -- there's no checkout/order-
-- placing flow on the customer side yet, so this will be genuinely empty
-- until that's built. It exists now so the business-side Orders list page
-- can honestly query real (if currently empty) data instead of showing
-- hardcoded placeholder orders.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  customer_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'delivered')),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Business owners manage their own orders" on public.orders;
create policy "Business owners manage their own orders"
  on public.orders for all
  using (
    exists (
      select 1 from public.businesses b
      where b.id = business_id and b.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.businesses b
      where b.id = business_id and b.owner_id = auth.uid()
    )
  );

drop policy if exists "Customers view their own orders" on public.orders;
create policy "Customers view their own orders"
  on public.orders for select
  using (auth.uid() = customer_id);

create index if not exists idx_orders_business on public.orders(business_id);
create index if not exists idx_orders_customer on public.orders(customer_id);
