import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { getBusinessNav } from '@/components/dashboard/businessNav';
import { requireRole } from '@/lib/auth/requireRole';
import type { Database } from '@/types/database';

type Business = Database['public']['Tables']['businesses']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];

export const metadata = {
  title: 'Dashboard',
};

function formatNaira(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString('en-NG')}`;
}

export default async function BusinessDashboardPage() {
  const { user, profile, supabase } = await requireRole(['business_owner']);

  const { data: businessData } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .single();

  const business = businessData as Business | null;
  if (!business) redirect('/register');
  const biz: Business = business as Business;

  const [{ data: productsData }, { data: ordersData }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('business_id', biz.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('orders')
      .select('*')
      .eq('business_id', biz.id)
      .order('created_at', { ascending: false }),
  ]);

  const products = (productsData as Product[] | null) ?? [];
  const orders = (ordersData as Order[] | null) ?? [];
  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const deliveredOrders = orders.filter((order) => order.status === 'delivered');

  const productIds = [...new Set(deliveredOrders.map((order) => order.product_id).filter(Boolean))] as string[];
  const deliveredProducts = productIds.length
    ? ((await supabase.from('products').select('id, price_kobo').in('id', productIds)).data as Pick<Product, 'id' | 'price_kobo'>[] | null) ?? []
    : [];
  const priceById = new Map(deliveredProducts.map((product) => [product.id, product.price_kobo]));
  const revenueKobo = deliveredOrders.reduce(
    (sum, order) => sum + (order.product_id ? priceById.get(order.product_id) ?? 0 : 0) * order.quantity,
    0
  );

  return (
    <DashboardShell
      navSections={getBusinessNav(biz.slug, 'dashboard')}
      signedInAs={profile.full_name || 'Business Owner'}
      signedInSubtext={`${biz.name} · ${biz.min_id ?? 'ID pending'}`}
      welcomeTitle="Business Dashboard"
      welcomeSubtitle={`Welcome back, ${profile.full_name?.split(' ')[0] || 'there'}. Here is what is happening with ${biz.name}.`}
    >
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Products Listed</h3></div>
        <div className="figure">{products.length}</div>
        <div className="delta delta-flat">Live on your profile</div>
      </div>

      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Total Orders</h3></div>
        <div className="figure">{orders.length}</div>
        <div className="delta delta-flat">All orders</div>
      </div>

      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Pending Orders</h3></div>
        <div className="figure">{pendingOrders.length}</div>
        <div className="delta delta-flat">Need your attention</div>
      </div>

      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Delivered Revenue</h3></div>
        <div className="figure" style={{ fontSize: 22 }}>{formatNaira(revenueKobo)}</div>
        <div className="delta delta-flat">From delivered orders</div>
      </div>

      <div className="widget span-2">
        <div className="widget-head">
          <h3>Recent Orders</h3>
          <Link href="/dashboard/orders" className="section-link">View all →</Link>
        </div>
        {orders.length === 0 ? (
          <div className="empty-state">No orders yet. Orders from customers will appear here.</div>
        ) : (
          orders.slice(0, 5).map((order) => (
            <div className="order-row" key={order.id}>
              <div>
                <b>Order #{order.id.slice(0, 8)}</b>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                  {new Date(order.created_at).toLocaleDateString('en-NG')} · Qty {order.quantity}
                </div>
              </div>
              <span className="dot-tag"><span className="dot-sm" />{order.status}</span>
            </div>
          ))
        )}
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Quick Actions</h3></div>
        <div style={{ display: 'grid', gap: 10 }}>
          <Link href="/dashboard/products" className="btn btn-primary">Add or manage products</Link>
          <Link href={`/business/${biz.slug}`} className="btn btn-outline">View public profile</Link>
          <Link href="/dashboard/verification" className="btn btn-outline">Check verification</Link>
        </div>
      </div>

      <div className="widget span-4">
        <div className="widget-head"><h3>Keep Your Business Profile Complete</h3></div>
        <div className="empty-state">
          A complete profile helps customers understand who you are, what you sell, and how to reach you.
          Keep your products, verification status, and public business information up to date.
        </div>
      </div>
    </DashboardShell>
  );
}
