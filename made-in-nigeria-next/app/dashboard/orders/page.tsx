import { redirect } from 'next/navigation';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { getBusinessNav } from '@/components/dashboard/businessNav';
import { requireRole } from '@/lib/auth/requireRole';
import MarkDeliveredButton from '@/components/dashboard/MarkDeliveredButton';
import type { Database } from '@/types/database';

type Business = Database['public']['Tables']['businesses']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

export const metadata = {
  title: 'Orders',
};

export default async function OrdersPage() {
  const { user, profile, supabase } = await requireRole(['business_owner']);

  const { data: businessData } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .single();
  const business = businessData as Business | null;
  if (!business) redirect('/register');
  const biz: Business = business as Business;

  const { data: ordersData } = await supabase
    .from('orders')
    .select('*')
    .eq('business_id', biz.id)
    .order('created_at', { ascending: false });
  const orders = (ordersData as Order[] | null) ?? [];

  // Separate query rather than an embedded select join -- keeps this on the
  // same defensive, explicitly-typed pattern as everything else querying
  // Supabase in this app (see requireRole.ts for why), rather than trusting
  // the generic resolver on a nested/joined select shape.
  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', biz.id);
  const products = (productsData as Product[] | null) ?? [];
  const productNameById = new Map(products.map((p) => [p.id, p.name]));

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  return (
    <DashboardShell
      navSections={getBusinessNav(biz.slug, 'orders')}
      signedInAs={profile.full_name || 'Business Owner'}
      signedInSubtext={`${biz.name} · ${biz.min_id ?? 'ID pending'}`}
      welcomeTitle="Orders"
      welcomeSubtitle={`${orders.length} order${orders.length === 1 ? '' : 's'} for ${biz.name}.`}
    >
      <div className="widget span-2 stat-widget">
        <div className="widget-head"><h3>Pending</h3></div>
        <div className="figure">{pendingOrders.length}</div>
        <div className="delta delta-flat">Awaiting fulfillment</div>
      </div>
      <div className="widget span-2 stat-widget">
        <div className="widget-head"><h3>Delivered</h3></div>
        <div className="figure">{deliveredOrders.length}</div>
        <div className="delta delta-up">Completed</div>
      </div>

      <div className="widget span-4">
        <div className="widget-head"><h3>All Orders</h3></div>
        {orders.length === 0 ? (
          <div className="empty-state">
            No orders yet. Orders will appear here once a customer places one from your product
            pages.
          </div>
        ) : (
          orders.map((order) => (
            <div className="order-row" key={order.id}>
              <span className="dot-tag">
                <span
                  className="dot-sm"
                  style={{ background: order.status === 'delivered' ? 'var(--forest-600)' : 'var(--gold-500)' }}
                />
                {order.product_id ? productNameById.get(order.product_id) ?? 'Product removed' : 'Unspecified item'}
              </span>
              {order.status === 'pending' ? (
                <MarkDeliveredButton orderId={order.id} />
              ) : (
                <b style={{ color: 'var(--forest-700)', textTransform: 'capitalize' }}>{order.status}</b>
              )}
            </div>
          ))
        )}
      </div>
    </DashboardShell>
  );
}
