import Link from 'next/link';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { getCustomerNav } from '@/components/dashboard/customerNav';
import { requireRole } from '@/lib/auth/requireRole';
import type { Database } from '@/types/database';

type Order = Database['public']['Tables']['orders']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Business = Database['public']['Tables']['businesses']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];
type SavedBusiness = Database['public']['Tables']['saved_businesses']['Row'];

export const metadata = {
  title: 'My Account',
};

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
    .eq('customer_id', user.id);
  const myReviews = (reviewsData as Review[] | null) ?? [];

  const { data: savedData } = await supabase
    .from('saved_businesses')
    .select('*')
    .eq('customer_id', user.id);
  const savedBusinesses = (savedData as SavedBusiness[] | null) ?? [];

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const recentOrders = orders.slice(0, 3);

  return (
    <DashboardShell
      navSections={getCustomerNav('overview')}
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
        <div className="widget-head"><h3>Reviews Written</h3></div>
        <div className="figure">{myReviews.length}</div>
        <div className="delta delta-flat">All time</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Saved Businesses</h3></div>
        <div className="figure">{savedBusinesses.length}</div>
        <div className="delta delta-flat">Following</div>
      </div>

      <div className="widget span-4">
        <div className="widget-head">
          <h3>Recent Orders</h3>
          <Link href="/account/orders" className="w-link">View all orders →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="empty-state">
            No orders yet. Browse the <Link href="/marketplace" className="link-gold">Marketplace</Link> to place your first one.
          </div>
        ) : (
          recentOrders.map((order) => {
            const p = order.product_id ? productById.get(order.product_id) : undefined;
            const b = businessById.get(order.business_id);
            return (
              <div className="order-row" key={order.id}>
                <span className="dot-tag">
                  <span
                    className="dot-sm"
                    style={{ background: order.status === 'delivered' ? 'var(--forest-600)' : 'var(--gold-500)' }}
                  />
                  {p?.name ?? 'Product'} &middot; {b?.name ?? 'Business'}
                </span>
                <b style={{ textTransform: 'capitalize' }}>{order.status}</b>
              </div>
            );
          })
        )}
      </div>
    </DashboardShell>
  );
}
