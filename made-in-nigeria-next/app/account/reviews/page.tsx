import Link from 'next/link';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { getCustomerNav } from '@/components/dashboard/customerNav';
import { requireRole } from '@/lib/auth/requireRole';
import type { Database } from '@/types/database';

type Review = Database['public']['Tables']['reviews']['Row'];
type Business = Database['public']['Tables']['businesses']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

export const metadata = {
  title: 'My Reviews',
};

export default async function MyReviewsPage() {
  const { user, profile, supabase } = await requireRole(['customer', 'professional']);

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });
  const reviews = (reviewsData as Review[] | null) ?? [];

  const businessIds = [...new Set(reviews.map((r) => r.business_id))];
  const { data: businessesData } = businessIds.length
    ? await supabase.from('businesses').select('*').in('id', businessIds)
    : { data: [] as Business[] };
  const businesses = (businessesData as Business[] | null) ?? [];
  const businessById = new Map(businesses.map((b) => [b.id, b]));

  const productIds = [...new Set(reviews.map((r) => r.product_id).filter((id): id is string => !!id))];
  const { data: productsData } = productIds.length
    ? await supabase.from('products').select('*').in('id', productIds)
    : { data: [] as Product[] };
  const products = (productsData as Product[] | null) ?? [];
  const productById = new Map(products.map((p) => [p.id, p]));

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return (
    <DashboardShell
      navSections={getCustomerNav('reviews')}
      signedInAs={profile.full_name || 'there'}
      signedInSubtext={user.email ?? ''}
      welcomeTitle="My Reviews"
      welcomeSubtitle={`${reviews.length} review${reviews.length === 1 ? '' : 's'} written.`}
    >
      <div className="widget span-4">
        <div className="widget-head"><h3>All Reviews</h3></div>
        {reviews.length === 0 ? (
          <div className="empty-state">
            No reviews written yet. You can review any delivered order from your{' '}
            <Link href="/account/orders" className="link-gold">Orders</Link> page.
          </div>
        ) : (
          reviews.map((review) => {
            const b = businessById.get(review.business_id);
            const p = review.product_id ? productById.get(review.product_id) : undefined;
            return (
              <div className="review-mini" key={review.id}>
                <div className="stamp" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" /></svg>
                </div>
                <div>
                  <div className="stars">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} &middot;{' '}
                    {b ? <Link href={`/business/${b.slug}`} className="link-gold">{b.name}</Link> : 'Business'}
                    {p && <> &middot; {p.name}</>}
                  </div>
                  {review.comment && <p>&quot;{review.comment}&quot;</p>}
                  <span style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>{formatDate(review.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardShell>
  );
}
