import { requireRole } from '@/lib/auth/requireRole';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function DueDiligencePage() {
  const { profile, supabase } = await requireRole(['investor']);

  const { data: investorProfile } = await supabase
    .from('investor_profiles')
    .select('id')
    .eq('user_id', profile.id)
    .single();

  // Fetch active due diligence requests
  const { data: dueDiligenceRequests } = await supabase
    .from('due_diligence_requests')
    .select(`
      *,
      businesses (
        id,
        name,
        category,
        state,
        city,
        verification_level
      )
    `)
    .eq('investor_id', investorProfile?.id)
    .order('created
