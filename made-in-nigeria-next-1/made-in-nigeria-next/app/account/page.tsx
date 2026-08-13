import DashboardShell, { DashboardNavSection } from '@/components/dashboard/DashboardShell';
import { requireRole } from '@/lib/auth/requireRole';
import OrdersWithReviews, { OrderDisplay } from '@/components/account/OrdersWithReviews';
import type { Database } from '@/types/database';

type Order = Database['public']['Tables']['orders']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Business = Database['public']['Tables']['businesses']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];

export const metadata = {
  title: 'My Account',
};

const NAV: DashboardNavSection[] = [
  {
    label: 'My Account',
    items: [
      { href: '/account', label: 'Overview', active: true, icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={3} y={3} width={7} height={9} rx={1.5} /><rect x={14} y={3} width={7} height={5} rx={1.5} /><rect x={14} y={12} width={7} height={9} rx={1.5} /><rect x={3} y={16} width={7} height={5} rx={1.5} /></svg>
      ) },
      { href: '#', label: 'Orders', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2l1.5 5H3l4 4-1.5 6L12 14l6.5 3L17 11l4-4h-4.5L15 2H9L6 2z" /></svg>
      ) },
      { href: '#', label: 'Wishlist', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20.8 4.6c-1.9-1.9-5-1.9-6.9 0L12 6.5l-1.9-1.9c-1.9-1.9-5-1.9-6.9 0-1.9 1.9-1.9 5 0 6.9L12 20.3l8.8-8.8c1.9-1.9 1.9-5 0-6.9z" /></svg>
      ) },
      { href: '#', label: 'Saved Businesses', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" /></svg>
      ) },
      { href: '#', label: 'My Reviews', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" /></svg>
      ) },
      { href: '#', label: 'Settings', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={3} /><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></svg>
      ) },
    ],
  },
];

export default async function CustomerDashboardPage() {
  const { user, profile, supabase } = await requireRole(['customer', 'professional']);

  const { data: ordersData } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });
  const orders = (ordersData as Order[] | null) ?? [];

  const productIds = [...new Set(orders.map((o) => o.product_id).filter((id): id is string => !!id))];
  const businessIds = [...new Set(orders.map((o) => o.business_id))];

  const { data: productsData } = productIds.length
    ? await supabase.from('products').select('*').in('id', productIds)
    : { data: [] as Product[] };
  const products = (productsData as Product[] | null) ?? [];
  const productById = new Map(products.map((p) => [p.id, p]));

  const { data: businessesData } = businessIds.length
    ? await supabase.from('businesses').select('*').in('id', businessIds)
    : { data: [] as Business[] };
  const businesses = (businessesData as Business[] | null) ?? [];
  const businessById = new Map(businesses.map((b) => [b.id, b]));

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });
  const myReviews = (reviewsData as Review[] | null) ?? [];
  const reviewedOrderIds = myReviews.map((r) => r.order_id);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  const orderDisplays: OrderDisplay[] = orders.map((order) => ({
    id: order.id,
    status: order.status,
    productName: (order.product_id && productById.get(order.product_id)?.name) || 'Product',
    businessName: businessById.get(order.business_id)?.name || 'Business',
    businessId: order.business_id,
    productId: order.product_id,
  }));

  return (
    <DashboardShell
      navSections={NAV}
      signedInAs={profile.full_name || 'there'}
      signedInSubtext={user.email ?? ''}
      welcomeTitle={`Welcome back, ${profile.full_name?.split(' ')[0] || 'there'}.`}
      welcomeSubtitle="Here's what's happening with your account."
    >
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Pending</h3></div>
        <div className="figure">{pendingOrders.length}</div>
        <div className="delta delta-flat">Awaiting delivery</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Delivered</h3></div>
        <div className="figure">{deliveredOrders.length}</div>
        <div className="delta delta-up">Since joining</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Wishlist</h3></div>
        <div className="figure">—</div>
        <div className="delta delta-flat">Not built yet</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Saved Businesses</h3></div>
        <div className="figure">—</div>
        <div className="delta delta-flat">Not built yet</div>
      </div>

      <div className="widget span-4">
        <div className="widget-head"><h3>Recent Orders</h3></div>
        <OrdersWithReviews orders={orderDisplays} reviewedOrderIds={reviewedOrderIds} />
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Wishlist</h3></div>
        <div className="empty-state">Saving products for later isn&apos;t built yet.</div>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Saved Businesses</h3></div>
        <div className="empty-state">Following businesses isn&apos;t built yet.</div>
      </div>

      <div className="widget span-4">
        <div className="widget-head"><h3>My Reviews</h3></div>
        {myReviews.length === 0 ? (
          <div className="empty-state">
            No reviews written yet. You can review any delivered order above.
          </div>
        ) : (
          myReviews.map((review) => {
            const b = businessById.get(review.business_id);
            return (
              <div className="review-mini" key={review.id}>
                <div className="stamp" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" /></svg>
                </div>
                <div>
                  <div className="stars">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} &middot; {b?.name ?? 'Business'}
                  </div>
                  {review.comment && <p>&quot;{review.comment}&quot;</p>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardShell>
  );
}
