import { notFound } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Stamp from '@/components/ui/Stamp';
import Tabs from '@/components/ui/Tabs';
import ProductGallery from '@/components/product/ProductGallery';
import OrderPanel from '@/components/product/OrderPanel';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];
type Business = Database['public']['Tables']['businesses']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];

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

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', item.id)
    .order('created_at', { ascending: false });
  const reviews = (reviewsData as Review[] | null) ?? [];

  const reviewerIds = [...new Set(reviews.map((r) => r.customer_id))];
  const { data: reviewersData } = reviewerIds.length
    ? await supabase.from('profiles').select('*').in('id', reviewerIds)
    : { data: [] as { id: string; full_name: string }[] };
  const reviewerNameById = new Map((reviewersData ?? []).map((p) => [p.id, p.full_name]));

  function reviewerLabel(customerId: string): string {
    const fullName = reviewerNameById.get(customerId);
    if (!fullName) return 'A Customer';
    const parts = fullName.trim().split(/\s+/);
    return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
  }

  const avgRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

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

          <OrderPanel businessId={seller.id} productId={item.id} />

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
                panel:
                  reviews.length > 0 ? (
                    <div style={{ marginTop: 26, maxWidth: 480 }}>
                      <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 12 }}>
                        {avgRating} average &middot; {reviews.length} review{reviews.length === 1 ? '' : 's'}
                      </p>
                      {reviews.map((review) => (
                        <div className="review-item" key={review.id}>
                          <div className="review-head">
                            <span>{reviewerLabel(review.customer_id)}</span>
                            <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                          </div>
                          {review.comment && <p>&quot;{review.comment}&quot;</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
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
