-- Made in Nigeria — add quantity to orders
-- Run this once in Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Depends on 0002_orders.sql having already been run.
--
-- The quantity stepper on Product Detail has existed since that page was
-- built but was purely decorative -- orders always recorded exactly one
-- unit regardless of what the stepper showed. This makes it real.

alter table public.orders
  add column if not exists quantity int not null default 1 check (quantity > 0);
