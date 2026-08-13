import { redirect } from 'next/navigation';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { getBusinessNav } from '@/components/dashboard/businessNav';
import { requireRole } from '@/lib/auth/requireRole';
import type { Database } from '@/types/database';

type Business = Database['public']['Tables']['businesses']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

export const metadata = {
  title: 'Analytics',
};

function formatNaira(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString('en-NG')}`;
}

function daysSince(dateString: string): number {
  const ms = Date.now() - new Date(dateString).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export default async function AnalyticsPage() {
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
    .eq('business_id', biz.id);
  const orders = (ordersData as Order[] | null) ?? [];

  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', biz.id);
  const products = (productsData as Product[] | null) ?? [];
  const priceById = new Map(products.map((p) => [p.id, p.price_kobo]));

  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const revenueKobo = deliveredOrders.reduce(
    (sum, o) => sum + (o.product_id ? priceById.get(o.product_id) ?? 0 : 0),
    0
  );
  const fulfillmentRate = orders.length > 0 ? Math.round((deliveredOrders.length / orders.length) * 100) : null;

  return (
    <DashboardShell
      navSections={getBusinessNav(biz.slug, 'analytics')}
      signedInAs={profile.full_name || 'Business Owner'}
      signedInSubtext={`${biz.name} · ${biz.min_id ?? 'ID pending'}`}
      welcomeTitle="Analytics"
      welcomeSubtitle={`Real numbers for ${biz.name} — nothing here is estimated.`}
    >
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Products Listed</h3></div>
        <div className="figure">{products.length}</div>
        <div className="delta delta-flat">Live on your profile</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Total Orders</h3></div>
        <div className="figure">{orders.length}</div>
        <div className="delta delta-flat">All time</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Fulfillment Rate</h3></div>
        <div className="figure">{fulfillmentRate !== null ? `${fulfillmentRate}%` : '—'}</div>
        <div className="delta delta-flat">{orders.length > 0 ? 'Delivered ÷ total orders' : 'No orders yet'}</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Days Active</h3></div>
        <div className="figure">{daysSince(biz.created_at)}</div>
        <div className="delta delta-flat">Since joining</div>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Revenue (Delivered Orders)</h3></div>
        <div className="rev-figure">{formatNaira(revenueKobo)}</div>
        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 8 }}>
          {deliveredOrders.length > 0
            ? `From ${deliveredOrders.length} delivered order${deliveredOrders.length === 1 ? '' : 's'}.`
            : 'No delivered orders yet — this updates automatically as orders are fulfilled.'}
        </p>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Orders by Status</h3></div>
        <div className="order-row"><span className="dot-tag"><span className="dot-sm" style={{ background: 'var(--gold-500)' }} />Pending</span><b>{pendingOrders.length}</b></div>
        <div className="order-row"><span className="dot-tag"><span className="dot-sm" style={{ background: 'var(--forest-600)' }} />Delivered</span><b>{deliveredOrders.length}</b></div>
      </div>

      <div className="widget span-4">
        <div className="widget-head"><h3>Not Tracked Yet</h3></div>
        <div className="empty-state">
          Page views, visitor traffic, conversion rate, and customer growth over time all need
          analytics infrastructure that isn&apos;t built yet — they&apos;d be estimates, not real
          numbers, so they&apos;re left out rather than shown as if they were tracked.
        </div>
      </div>
    </DashboardShell>
  );
}
