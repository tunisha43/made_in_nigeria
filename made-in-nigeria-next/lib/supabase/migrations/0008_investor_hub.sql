-- Investor Hub schema
create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references public.profiles(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  invested_kobo bigint not null check (invested_kobo > 0),
  current_value_kobo bigint not null default 0 check (current_value_kobo >= 0),
  return_pct numeric(8,2) not null default 0,
  status text not null default 'active' check (status in ('active','completed','pending')),
  created_at timestamptz not null default now()
);

create table if not exists public.investment_opportunities (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  target_kobo bigint not null check (target_kobo > 0),
  committed_kobo bigint not null default 0 check (committed_kobo >= 0),
  min_kobo bigint not null check (min_kobo > 0),
  projected_return_pct numeric(8,2) not null default 0,
  description text,
  status text not null default 'open' check (status in ('open','funded','closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.escrow_accounts (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references public.profiles(id) on delete cascade,
  investment_id uuid references public.investments(id) on delete set null,
  balance_kobo bigint not null default 0 check (balance_kobo >= 0),
  status text not null default 'held' check (status in ('held','released','disputed')),
  created_at timestamptz not null default now()
);

alter table public.investments enable row level security;
alter table public.investment_opportunities enable row level security;
alter table public.escrow_accounts enable row level security;

drop policy if exists "Investors read own investments" on public.investments;
create policy "Investors read own investments" on public.investments for select using (auth.uid() = investor_id);
drop policy if exists "Investors read open opportunities" on public.investment_opportunities;
create policy "Investors read open opportunities" on public.investment_opportunities for select using (status = 'open');
drop policy if exists "Investors read own escrow" on public.escrow_accounts;
create policy "Investors read own escrow" on public.escrow_accounts for select using (auth.uid() = investor_id);

create index if not exists idx_investments_investor on public.investments(investor_id);
create index if not exists idx_investments_business on public.investments(business_id);
create index if not exists idx_opportunities_status on public.investment_opportunities(status);
create index if not exists idx_escrow_investor on public.escrow_accounts(investor_id);
