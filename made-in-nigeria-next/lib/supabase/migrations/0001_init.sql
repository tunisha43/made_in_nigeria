-- Made in Nigeria — initial schema
-- Run this once in Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run: every statement uses IF NOT EXISTS / OR REPLACE / DROP...IF EXISTS first.

-- ============================================================
-- PROFILES
-- One row per signed-up user, created automatically on signup
-- (see the trigger at the bottom). Mirrors the shape already
-- assumed by types/database.ts and lib/auth/requireRole.ts.
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'customer'
    check (role in ('customer','business_owner','professional','investor','admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up. Reads full_name/role
-- out of the signUp() call's options.data — see AuthForm.tsx.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- BUSINESSES
-- ============================================================
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  category text not null,
  state text,
  city text,
  min_id text unique,
  verification_level text not null default 'registered'
    check (verification_level in ('registered','verified','advanced_verified')),
  description text,
  health_score int,
  created_at timestamptz not null default now()
);

alter table public.businesses enable row level security;

drop policy if exists "Businesses are publicly readable" on public.businesses;
create policy "Businesses are publicly readable"
  on public.businesses for select
  using (true);

drop policy if exists "Owners manage their own businesses" on public.businesses;
create policy "Owners manage their own businesses"
  on public.businesses for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  price_kobo bigint not null,
  compare_at_price_kobo bigint,
  description text,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable"
  on public.products for select
  using (true);

drop policy if exists "Business owners manage their own products" on public.products;
create policy "Business owners manage their own products"
  on public.products for all
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

-- ============================================================
-- Indexes worth having from day one
-- ============================================================
create index if not exists idx_businesses_owner on public.businesses(owner_id);
create index if not exists idx_products_business on public.products(business_id);
