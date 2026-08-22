-- Community Hub + Featured Stories
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  sector text not null,
  title text,
  body text not null,
  status text not null default 'published' check (status in ('draft','published','archived')),
  likes_count int not null default 0 check (likes_count >= 0),
  comments_count int not null default 0 check (comments_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  story_type text not null default 'Founder Story' check (story_type in ('Founder Story','Behind the Business','Innovation Story','Community Impact')),
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.community_posts enable row level security;
alter table public.stories enable row level security;

drop policy if exists "Published community posts are public" on public.community_posts;
create policy "Published community posts are public" on public.community_posts for select using (status = 'published');

drop policy if exists "Business owners manage their community posts" on public.community_posts;
create policy "Business owners manage their community posts" on public.community_posts for all
using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()))
with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));

drop policy if exists "Published stories are public" on public.stories;
create policy "Published stories are public" on public.stories for select using (status = 'published');

drop policy if exists "Business owners manage their stories" on public.stories;
create policy "Business owners manage their stories" on public.stories for all
using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()))
with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));

create index if not exists idx_community_posts_public on public.community_posts(status, created_at desc);
create index if not exists idx_community_posts_business on public.community_posts(business_id, created_at desc);
create index if not exists idx_stories_public on public.stories(status, featured, published_at desc);
create index if not exists idx_stories_business on public.stories(business_id, created_at desc);

create or replace function public.set_community_stories_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

drop trigger if exists community_posts_updated_at on public.community_posts;
create trigger community_posts_updated_at before update on public.community_posts for each row execute function public.set_community_stories_updated_at();
drop trigger if exists stories_updated_at on public.stories;
create trigger stories_updated_at before update on public.stories for each row execute function public.set_community_stories_updated_at();
