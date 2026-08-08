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

**Done:**
- Project foundation: config, fonts, global CSS, Header/Footer, Tabs/BizCard/Badge/Stamp components
- Home, Our Story, Marketplace

**Not yet ported** (still only exist as static HTML in `made-in-nigeria-site-src/pages/`):
Product Detail, Business Profile, Register, Auth, Business Dashboard, Customer Dashboard, Investor Hub, Community Hub, Events, Trust & Verification, National Hub, Admin, Legal

**Known open decision:** `Header.tsx`'s "Business Hub" nav item still points at `/business-hub`, a route that doesn't exist yet — in the static site this linked to one hardcoded example business profile, but real business profiles will live at `/business/[slug]` once that page is ported. Decide what "Business Hub" in the top nav should actually point to (a general landing page? drop it from top-nav entirely?) before that route gets built.

## What's still placeholder data

Every business/product shown (Adaeze Textiles, Ankara Wrap Set, etc.) is hardcoded in each page file, not queried from Supabase. Look for the comment `// Placeholder data standing in for a real query` above each data array — that's exactly where a `supabase.from(...)` call replaces it once the database schema exists.
