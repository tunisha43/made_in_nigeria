import { notFound } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Stamp from '@/components/ui/Stamp';
import Tabs from '@/components/ui/Tabs';
import ProductGallery from '@/components/product/ProductGallery';
import QtyStepper from '@/components/product/QtyStepper';

// Placeholder lookup standing in for:
//   supabase.from('products').select('*, business:businesses(*)').eq('slug', slug).single()
const PRODUCTS = {
  'ankara-wrap-set': {
    name: 'Ankara Wrap Set',
    category: 'Textiles & Fashion',
    priceNow: '₦18,500',
    priceWas: '₦23,000',
    badge: 'Export-Ready' as const,
    description:
      'A two-piece wrap set hand-dyed in traditional Ankara patterns, tailored to order in Aba. Includes wrap skirt and matching head tie. Machine-washable; colors set with a vinegar rinse before first wear.',
    longDescription:
      "Hand-dyed using traditional resist techniques, then tailored to order. Every piece is cut and sewn in Adaeze Textiles' Aba workshop -- no two dye patterns are perfectly identical, which is part of the character of genuine Ankara work.",
    images: ['thumb-3', 'thumb-1', 'thumb-5', 'thumb-6'],
    specs: [
      { label: 'Material', value: '100% cotton Ankara wax print' },
      { label: 'Sizes available', value: 'S – XXL (made to order)' },
      { label: 'Care', value: 'Hand wash cold, line dry' },
      { label: 'Origin', value: 'Aba, Abia State' },
    ],
    seller: {
      slug: 'adaeze-textiles',
      name: 'Adaeze Textiles',
      location: 'Aba, Abia State',
      minId: 'MIN-NG-00004582',
      thumb: 'thumb-2',
    },
  },
} as const;

type ProductSlug = keyof typeof PRODUCTS;

const RELATED_PRODUCTS = [
  { slug: 'adire-table-runner', thumb: 'thumb-1', badge: 'trending' as const, badgeLabel: 'Export-Ready', name: 'Adire Table Runner', price: '₦11,000' },
  { slug: 'aso-oke-headwrap', thumb: 'thumb-6', badge: 'new' as const, badgeLabel: 'New', name: 'Aso-Oke Headwrap', price: '₦7,500' },
  { slug: 'adire-throw-pillow', thumb: 'thumb-5', badge: 'verified' as const, badgeLabel: 'Verified', name: 'Adire Throw Pillow Cover', price: '₦6,200' },
  { slug: 'ankara-tote-bag', thumb: 'thumb-3', badge: 'trending' as const, badgeLabel: 'Export-Ready', name: 'Ankara Tote Bag', price: '₦9,800' },
];

export function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS[slug as ProductSlug];
  if (!product) notFound();

  return (
    <>
      <div className="wrap breadcrumb">
        <Link href="/">Home</Link> / <Link href="/marketplace">Marketplace</Link> / {product.name}
      </div>

      <section className="wrap product-grid">
        <ProductGallery images={[...product.images]} />

        <div>
          <div className="product-cat">{product.category}</div>
          <h1 className="product-title">{product.name}</h1>
          <Badge variant="trending">{product.badge}</Badge>

          <div className="price-block">
            <span className="price-now">{product.priceNow}</span>
            <span className="price-was">{product.priceWas}</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 10 }}>
            {product.description}
          </p>

          <Link href={`/business/${product.seller.slug}`} className="seller-row">
            <div className={`seller-avatar ${product.seller.thumb}`} aria-hidden="true" />
            <div style={{ flex: 1 }}>
              <div className="name">{product.seller.name}</div>
              <div className="meta">{product.seller.location} &middot; {product.seller.minId}</div>
            </div>
            <Badge variant="verified">Verified</Badge>
          </Link>

          <div className="qty-row">
            <QtyStepper />
            <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>Ships within 3–5 business days</span>
          </div>

          <div className="product-actions">
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} type="button">
              Add to Cart
            </button>
            <Link href="/auth" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
              Message Seller
            </Link>
          </div>

          <div className="trust-mini">
            <div className="trust-mini-item">
              <Stamp>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7" /></svg>
              </Stamp>
              Verified seller
            </div>
            <div className="trust-mini-item">
              <Stamp>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </Stamp>
              Escrow-protected payment
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
                    {product.longDescription}
                  </div>
                ),
              },
              {
                key: 'specs',
                label: 'Specifications',
                panel: (
                  <div style={{ marginTop: 26 }}>
                    {product.specs.map((s) => (
                      <div className="hp-row" style={{ maxWidth: 480 }} key={s.label}>
                        <span>{s.label}</span><b>{s.value}</b>
                      </div>
                    ))}
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

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">From the same seller</div>
              <h2>More from {product.seller.name}</h2>
            </div>
          </div>
          <div className="card-grid">
            {RELATED_PRODUCTS.map((p) => (
              <Link key={p.slug} href={`/product/${p.slug}`} className="biz-card">
                <div className={`biz-thumb ${p.thumb}`}>
                  <Badge variant={p.badge}>{p.badgeLabel}</Badge>
                </div>
                <div className="biz-body">
                  <h4>{p.name}</h4>
                  <div className="biz-meta">{p.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
