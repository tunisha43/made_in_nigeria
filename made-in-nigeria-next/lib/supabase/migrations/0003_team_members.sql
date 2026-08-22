-- Made in Nigeria — team_members table
-- Run this once in Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Depends on 0001_init.sql having already been run.
--
-- Deliberately NOT tied to auth.users / profiles -- this is a manually
-- maintained roster the business owner types in themselves (name, position,
-- contact info, start date), not an invite-and-signup system. end_date is
-- set later, when someone stops working there -- rows are never deleted, so
-- the business keeps a real history of who has worked there.

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  position text not null,
  phone text,
  email text,
  start_date date not null,
  end_date date,
  created_at timestamptz not null default now()
);

alter table public.team_members enable row level security;

drop policy if exists "Owners manage their own team members" on public.team_members;
create policy "Owners manage their own team members"
  on public.team_members for all
  using (
    exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
  );

create index if not exists idx_team_members_business on public.team_members(business_id);
