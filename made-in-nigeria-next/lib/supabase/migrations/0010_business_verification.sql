-- Business verification workflow + private document storage.
create table if not exists public.business_verification_submissions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references public.businesses(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft','pending','approved','rejected')),
  notes text,
  review_notes text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_verification_documents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  document_type text not null check (document_type in ('registration','identity','address')),
  file_name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

alter table public.business_verification_submissions enable row level security;
alter table public.business_verification_documents enable row level security;

drop policy if exists "Owners can read their verification submission" on public.business_verification_submissions;
create policy "Owners can read their verification submission" on public.business_verification_submissions
  for select using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));

drop policy if exists "Owners can create their verification submission" on public.business_verification_submissions;
create policy "Owners can create their verification submission" on public.business_verification_submissions
  for insert with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));

drop policy if exists "Owners can update their verification submission" on public.business_verification_submissions;
create policy "Owners can update their verification submission" on public.business_verification_submissions
  for update using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()))
  with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));

drop policy if exists "Owners can read their verification documents" on public.business_verification_documents;
create policy "Owners can read their verification documents" on public.business_verification_documents
  for select using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));

drop policy if exists "Owners can create their verification documents" on public.business_verification_documents;
create policy "Owners can create their verification documents" on public.business_verification_documents
  for insert with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));

-- Private bucket for sensitive verification files.
insert into storage.buckets (id, name, public) values ('verification-documents', 'verification-documents', false)
on conflict (id) do update set public = false;

drop policy if exists "Owners upload verification documents" on storage.objects;
create policy "Owners upload verification documents" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'verification-documents'
    and exists (select 1 from public.businesses b where b.owner_id = auth.uid() and name like b.id::text || '/%')
  );

drop policy if exists "Owners read verification documents" on storage.objects;
create policy "Owners read verification documents" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'verification-documents'
    and exists (select 1 from public.businesses b where b.owner_id = auth.uid() and name like b.id::text || '/%')
  );

create index if not exists idx_verification_documents_business on public.business_verification_documents(business_id);
