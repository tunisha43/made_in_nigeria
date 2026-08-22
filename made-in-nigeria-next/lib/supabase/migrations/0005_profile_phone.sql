-- Made in Nigeria — add phone to profiles
-- Run this once in Supabase Dashboard → SQL Editor → New query → paste → Run.
--
-- Phone is collected on the Create Account form but was never actually
-- stored anywhere -- AuthForm.tsx reads it from the form but only passes
-- full_name and role to supabase.auth.signUp()'s metadata. Adding it here
-- so Settings has somewhere real to save it. Existing rows get null, which
-- is fine -- the Settings form treats it as optional.

alter table public.profiles add column if not exists phone text;

-- Update the signup trigger (originally in 0001_init.sql) to also capture
-- phone for new signups going forward, now that there's a column for it.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$;
