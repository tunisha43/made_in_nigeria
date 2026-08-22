-- Marketplace cart + checkout support.
-- Run after 0007_order_quantity.sql.

alter table public.orders add column if not exists unit_price_kobo integer;
alter table public.orders add column if not exists total_kobo integer;
alter table public.orders add column if not exists shipping_name text;
alter table public.orders add column if not exists shipping_phone text;
alter table public.orders add column if not exists shipping_address text;
alter table public.orders add column if not exists shipping_city text;
alter table public.orders add column if not exists shipping_state text;
alter table public.orders add column if not exists payment_method text default 'pay_on_delivery';
alter table public.orders add column if not exists payment_status text default 'unpaid';
alter table public.orders add column if not exists notes text;

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check (status in ('pending','confirmed','shipped','delivered','cancelled'));

alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders add constraint orders_payment_status_check check (payment_status in ('unpaid','pending','paid','failed','refunded'));

alter table public.orders enable row level security;

drop policy if exists "Customers create their own orders" on public.orders;
create policy "Customers create their own orders"
  on public.orders for insert
  with check (auth.uid() = customer_id);

create index if not exists idx_orders_customer_created on public.orders(customer_id, created_at desc);
