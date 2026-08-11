import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';
import type { User } from '@supabase/supabase-js';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Role = Profile['role'];

export interface RequireRoleResult {
  user: User;
  profile: Profile;
  supabase: Awaited<ReturnType<typeof createClient>>;
}

/**
 * Call this at the top of any protected Server Component page, e.g.:
 *
 *   const { profile } = await requireRole(['business_owner']);
 *
 * - Not signed in -> redirects to /auth
 * - Signed in but wrong role -> redirects to "/" rather than showing a
 *   confusing 403; the nav will just look like they never had access
 * - Otherwise returns { user, profile } so the page can show real data
 *   (name, id, etc.) instead of the hardcoded placeholders every
 *   dashboard-style page currently uses
 *
 * Deliberately called per-page instead of centralized in middleware.ts,
 * so every protected route states its own required role explicitly in
 * the page file itself -- easy to audit, easy to get right.
 *
 * NOTE: every variable below has an explicit type annotation rather than
 * relying on TypeScript narrowing `user`/`profile` to non-null after the
 * `if (...) { redirect(...) }` checks. That narrowing SHOULD work (redirect()
 * is typed to return `never`), but in practice it caused this function's
 * inferred return type to collapse to `never` entirely, which broke every
 * page that calls it with "Property 'x' does not exist on type 'never'".
 * Explicit types + non-null assertions sidestep that regardless of the
 * exact cause.
 */
export async function requireRole(allowedRoles: Role[]): Promise<RequireRoleResult> {
  const supabase = await createClient();

  const {
    data: { user: maybeUser },
  } = await supabase.auth.getUser();

  if (!maybeUser) {
    redirect('/auth');
  }
  const user: User = maybeUser as User;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const maybeProfile: Profile | null = data;

  if (!maybeProfile) {
    redirect('/');
  }
  const profile: Profile = maybeProfile as Profile;

  if (!allowedRoles.includes(profile.role)) {
    redirect('/');
  }

  return { user, profile, supabase };
}
