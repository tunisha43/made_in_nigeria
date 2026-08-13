import { notFound } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Stamp from '@/components/ui/Stamp';
import Tabs from '@/components/ui/Tabs';
import ProductGallery from '@/components/product/ProductGallery';
import QtyStepper from '@/components/product/QtyStepper';
import PlaceOrderButton from '@/components/product/PlaceOrderButton';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];
type Business = Database['public']['Tables']['businesses']['Row'];

const THUMBS = ['thumb-1', 'thumb-2', 'thumb-3', 'thumb-4', 'thumb-5', 'thumb-6'];

function formatNaira(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString('en-NG')}`;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: productData } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  const product = productData as Product | null;
  if (!product) notFound();
  const item: Product = product as Product;

  const { data: businessData } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', item.business_id)
    .single();
  const business = businessData as Business | null;
  // A product should never outlive its business given the foreign key, but
  // guard anyway rather than crash rendering if data is ever inconsistent.
  if (!business) notFound();
  const seller: Business = business as Business;

  const { data: relatedData } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', seller.id)
    .neq('id', item.id)
    .limit(4);
  const related = (relatedData as Product[] | null) ?? [];

  // No real product photos exist yet (Supabase Storage isn't wired up) --
  // one deterministic placeholder gradient stands in, picked from the
  // product id so it's at least stable across page loads.
  const thumbIndex = item.id.charCodeAt(0) % THUMBS.length;
  const isSellerVerified = seller.verification_level !== 'registered';
  const locationParts = [seller.city, seller.state].filter(Boolean).join(', ');

  return (
    <>
      <div className="wrap breadcrumb">
        <Link href="/">Home</Link> / <Link href="/marketplace">Marketplace</Link> / {item.name}
      </div>

      <section className="wrap product-grid">
        <ProductGallery images={[THUMBS[thumbIndex]]} />

        <div>
          <div className="product-cat">{seller.category}</div>
          <h1 className="product-title">{item.name}</h1>

          <div className="price-block">
            <span className="price-now">{formatNaira(item.price_kobo)}</span>
            {item.compare_at_price_kobo && item.compare_at_price_kobo > item.price_kobo && (
              <span className="price-was">{formatNaira(item.compare_at_price_kobo)}</span>
            )}
          </div>
          {item.description && (
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 10 }}>
              {item.description}
            </p>
          )}

          <Link href={`/business/${seller.slug}`} className="seller-row">
            <div className={`seller-avatar ${THUMBS[(thumbIndex + 1) % THUMBS.length]}`} aria-hidden="true" />
            <div style={{ flex: 1 }}>
              <div className="name">{seller.name}</div>
              <div className="meta">{locationParts || seller.category} &middot; {seller.min_id ?? 'ID pending'}</div>
            </div>
            {isSellerVerified && <Badge variant="verified">Verified</Badge>}
          </Link>

          <div className="qty-row">
            <QtyStepper />
            <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
              Seller will confirm delivery timing after ordering
            </span>
          </div>

          <div className="product-actions">
            <PlaceOrderButton businessId={seller.id} productId={item.id} />
            <Link href="/auth" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
              Message Seller
            </Link>
          </div>

          <div className="trust-mini">
            <div className="trust-mini-item">
              <Stamp>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7" /></svg>
              </Stamp>
              {isSellerVerified ? 'Verified seller' : 'Registered seller'}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <Tabs
            tabs={[
              {
                key: 'description',
                label: 'Description',
                panel: (
                  <div style={{ maxWidth: '70ch', marginTop: 26, fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                    {item.description || 'No additional description provided for this product yet.'}
                  </div>
                ),
              },
              {
                key: 'reviews',
                label: 'Reviews',
                panel: (
                  <div className="empty-state" style={{ marginTop: 26, maxWidth: 480 }}>
                    No reviews yet. Be the first to review this product after your order arrives.
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {related.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="eyebrow">From the same seller</div>
                <h2>More from {seller.name}</h2>
              </div>
            </div>
            <div className="card-grid">
              {related.map((p, i) => (
                <Link key={p.slug} href={`/product/${p.slug}`} className="biz-card">
                  <div className={`biz-thumb ${THUMBS[i % THUMBS.length]}`} />
                  <div className="biz-body">
                    <h4>{p.name}</h4>
                    <div className="biz-meta">{formatNaira(p.price_kobo)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
