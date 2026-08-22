# Made in Nigeria — Next.js Migration

Migrated from the static HTML site (`made-in-nigeria-site-src/`) to Next.js 15 (App Router) + TypeScript, with Supabase scaffolded in but not yet connected to a real project.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in Supabase values once a project exists — safe to leave blank for now
npm run dev
```

Open http://localhost:3000.

**Note:** This project was written without the ability to run `npm install` or `next dev` in the environment that generated it (no network access there). It's built carefully and every file has been checked for balanced braces/tags, but you'll be the first to see it actually compile. If `npm run dev` throws an error, paste it back and it'll get fixed immediately.

## Project structure

```
app/
  layout.tsx              Root layout — fonts only, no header/footer (see below)
  globals.css              Full design system, ported 1:1 from the static site's CSS
  (marketing)/             Route group: public pages, wrapped in Header+Footer
    layout.tsx
    page.tsx                Home
    our-story/page.tsx
    marketplace/page.tsx
components/
  layout/Header.tsx, Footer.tsx
  ui/Tabs.tsx, BizCard.tsx, Badge.tsx, Stamp.tsx    Shared design-system pieces
lib/supabase/client.ts, server.ts                    Supabase client setup (unused until env vars are real)
types/database.ts                                    Hand-written types; replace with `supabase gen types` later
```

Different sections of the app need different chrome (marketing nav+footer vs. the auth split-screen vs. dashboard sidebars), so the root `layout.tsx` deliberately has none — each route group adds its own.

## Migration status

## Migration status: COMPLETE — all 16 pages ported

Home, Our Story, Marketplace, Business Profile (`/business/[slug]`), Product Detail (`/product/[slug]`),
Register, Auth, Business Dashboard (`/dashboard`), Customer Dashboard (`/account`), Investor Hub,
Community Hub, Events, Trust & Verification, National Hub, Admin, Legal.

Every page passed a final project-wide sweep: brace/paren balance, no leftover `\uXXXX` escape bugs,
no unused imports, and every internal link cross-checked against an actual existing route.

**One pre-existing, still-open item** (flagged since the first foundation audit, not new): `Header.tsx`'s
"Business Hub" nav item still points at `/business-hub`, which doesn't exist — decide what that should
actually link to (a general businesses landing page? removed from top-nav since Marketplace already
covers browsing?) before it gets built.

## What's NOT done — real remaining work before this is a working app

Porting the pages was the mechanical part. None of the following exists yet:

- **No real Supabase project connected.** `lib/supabase/` is real, working client setup — but every
  page still uses hardcoded placeholder data (search for `Placeholder data standing in for a real query`
  comments). Nothing reads or writes to a database yet.
- **No real authentication.** `/auth` has working UI and local component state, but doesn't call
  `supabase.auth` — signing in does nothing except show a fake success message.
- **No role gating.** `/dashboard`, `/account`, `/investor-hub`, `/admin` are all publicly reachable by
  anyone who knows the URL — nothing checks who's signed in or what role they have. This is the
  single biggest gap between "pages exist" and "this is a real app," and it's exactly the kind of
  thing static HTML could never do at all, which was the whole reason for this migration.
- **Only one example business/product exists** in each lookup table (Adaeze Textiles, Ankara Wrap Set).
  Every other business/product card across the site links to a slug with no matching page yet.

**Known open decision:** `Header.tsx`'s "Business Hub" nav item still points at `/business-hub`, a route that doesn't exist yet — in the static site this linked to one hardcoded example business profile, but real business profiles will live at `/business/[slug]` once that page is ported. Decide what "Business Hub" in the top nav should actually point to (a general landing page? drop it from top-nav entirely?) before that route gets built.

## What's still placeholder data

Every business/product shown (Adaeze Textiles, Ankara Wrap Set, etc.) is hardcoded in each page file, not queried from Supabase. Look for the comment `// Placeholder data standing in for a real query` above each data array — that's exactly where a `supabase.from(...)` call replaces it once the database schema exists.
