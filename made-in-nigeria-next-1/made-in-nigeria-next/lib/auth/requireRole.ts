import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Role = Profile['role'];

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
 */
export async function requireRole(allowedRoles: Role[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect('/');
  }

  return { user, profile };
}
