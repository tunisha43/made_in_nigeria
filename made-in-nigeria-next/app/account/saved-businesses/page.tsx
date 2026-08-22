import Link from 'next/link';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { getCustomerNav } from '@/components/dashboard/customerNav';
import { requireRole } from '@/lib/auth/requireRole';
import UnsaveBusinessButton from '@/components/account/UnsaveBusinessButton';
import type { Database } from '@/types/database';

type SavedBusiness = Database['public']['Tables']['saved_businesses']['Row'];
type Business = Database['public']['Tables']['businesses']['Row'];

export const metadata = {
  title: 'Saved Businesses',
};

export default async function SavedBusinessesPage() {
  const { user, profile, supabase } = await requireRole(['customer', 'professional']);

  const { data: savedData } = await supabase
    .from('saved_businesses')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });
  const saved = (savedData as SavedBusiness[] | null) ?? [];

  const businessIds = saved.map((s) => s.business_id);
  const { data: businessesData } = businessIds.length
    ? await supabase.from('businesses').select('*').in('id', businessIds)
    : { data: [] as Business[] };
  const businesses = (businessesData as Business[] | null) ?? [];
  const businessById = new Map(businesses.map((b) => [b.id, b]));

  return (
    <DashboardShell
      navSections={getCustomerNav('saved-businesses')}
      signedInAs={profile.full_name || 'there'}
      signedInSubtext={user.email ?? ''}
      welcomeTitle="Saved Businesses"
      welcomeSubtitle={`${saved.length} business${saved.length === 1 ? '' : 'es'} you're following.`}
    >
      <div className="widget span-4">
        <div className="widget-head"><h3>Following</h3></div>
        {saved.length === 0 ? (
          <div className="empty-state">
            No saved businesses yet. Follow one from its{' '}
            <Link href="/marketplace" className="link-gold">profile page</Link> to see it here.
          </div>
        ) : (
          saved.map((row) => {
            const b = businessById.get(row.business_id);
            return (
              <div className="order-row" key={row.id}>
                <span className="dot-tag">
                  <span className="dot-sm" style={{ background: 'var(--forest-600)' }} />
                  {b ? (
                    <Link href={`/business/${b.slug}`} className="link-gold">{b.name}</Link>
                  ) : (
                    'Business no longer available'
                  )}
                  {b?.city && <span style={{ color: 'var(--ink-soft)' }}> &middot; {b.city}</span>}
                </span>
                <UnsaveBusinessButton savedRowId={row.id} />
              </div>
            );
          })
        )}
      </div>
    </DashboardShell>
  );
}
