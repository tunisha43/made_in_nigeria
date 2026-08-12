import { redirect } from 'next/navigation';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { getBusinessNav } from '@/components/dashboard/businessNav';
import { requireRole } from '@/lib/auth/requireRole';
import AddProductForm from '@/components/dashboard/AddProductForm';
import DeleteProductButton from '@/components/dashboard/DeleteProductButton';
import type { Database } from '@/types/database';

type Business = Database['public']['Tables']['businesses']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

export const metadata = {
  title: 'Products',
};

function formatNaira(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString('en-NG')}`;
}

export default async function ProductsPage() {
  const { user, profile, supabase } = await requireRole(['business_owner']);

  const { data: businessData } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .single();
  const business = businessData as Business | null;
  if (!business) redirect('/register');
  const biz: Business = business as Business;

  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', biz.id)
    .order('created_at', { ascending: false });
  const products = (productsData as Product[] | null) ?? [];

  return (
    <DashboardShell
      navSections={getBusinessNav(biz.slug, 'products')}
      signedInAs={profile.full_name || 'Business Owner'}
      signedInSubtext={`${biz.name} · ${biz.min_id ?? 'ID pending'}`}
      welcomeTitle="Products"
      welcomeSubtitle={`${products.length} product${products.length === 1 ? '' : 's'} listed for ${biz.name}.`}
    >
      <div className="widget span-4">
        <div className="widget-head"><h3>Add a Product</h3></div>
        <AddProductForm businessId={biz.id} />
      </div>

      <div className="widget span-4">
        <div className="widget-head"><h3>Your Products</h3></div>
        {products.length === 0 ? (
          <div className="empty-state">
            No products yet. Add your first one above — it&apos;ll appear on your public profile right away.
          </div>
        ) : (
          products.map((p) => (
            <div className="order-row" key={p.id}>
              <span>
                <b>{p.name}</b>
                <span style={{ color: 'var(--ink-soft)', marginLeft: 8 }}>{formatNaira(p.price_kobo)}</span>
              </span>
              <DeleteProductButton productId={p.id} productName={p.name} />
            </div>
          ))
        )}
      </div>
    </DashboardShell>
  );
}
