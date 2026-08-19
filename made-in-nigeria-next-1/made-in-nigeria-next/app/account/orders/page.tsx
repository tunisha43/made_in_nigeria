import DashboardShell from '@/components/dashboard/DashboardShell';
import { getCustomerNav } from '@/components/dashboard/customerNav';
import { requireRole } from '@/lib/auth/requireRole';
import OrdersWithReviews, { OrderDisplay } from '@/components/account/OrdersWithReviews';
import type { Database } from '@/types/database';

type Order = Database['public']['Tables']['orders']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Business = Database['public']['Tables']['businesses']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];

export const metadata = {
  title: 'My Orders',
};

export default async function CustomerOrdersPage() {
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
    quantity: order.quantity,
  }));

  return (
    <DashboardShell
      navSections={getCustomerNav('orders')}
      signedInAs={profile.full_name || 'there'}
      signedInSubtext={user.email ?? ''}
      welcomeTitle="My Orders"
      welcomeSubtitle={`${orders.length} order${orders.length === 1 ? '' : 's'} · ${pendingOrders.length} pending, ${deliveredOrders.length} delivered.`}
    >
      <div className="widget span-4">
        <div className="widget-head"><h3>All Orders</h3></div>
        <OrdersWithReviews orders={orderDisplays} reviewedOrderIds={reviewedOrderIds} />
      </div>
    </DashboardShell>
  );
}
