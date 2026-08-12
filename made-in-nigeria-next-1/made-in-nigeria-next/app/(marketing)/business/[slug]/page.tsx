import { notFound } from 'next/navigation';
import Link from 'next/link';
import Stamp from '@/components/ui/Stamp';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Business = Database['public']['Tables']['businesses']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

const THUMBS = ['thumb-1', 'thumb-2', 'thumb-3', 'thumb-4', 'thumb-5', 'thumb-6'];

// What each verification level actually means -- same wording as
// /trust-verification, since the schema only tracks one level per business
// (not granular sub-checks like "identity confirmed" / "location confirmed"
// as separate flags), a real checklist with individually-ticked items would
// be fabricating detail the database doesn't have. Showing the honest
// current level plus what it means is the accurate version of this section.
const LEVEL_INFO: Record<Business['verification_level'], { label: string; desc: string }> = {
  registered: {
    label: 'Registered',
    desc: 'Basic details submitted. Identity and location have not been confirmed yet.',
  },
  verified: {
    label: 'Verified',
    desc: 'Identity confirmed and physical location checked. Registration document on file.',
  },
  advanced_verified: {
    label: 'Advanced Verified',
    desc: 'Everything in Verified, plus financial history review and consistent fulfillment record.',
  },
};

function formatNaira(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString('en-NG')}`;
}

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: businessData } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single();

  // Explicit cast rather than trusting the generic chain -- see the long
  // comment in lib/auth/requireRole.ts for why.
  const business = businessData as Business | null;
  if (!business) notFound();
  const biz: Business = business as Business;

  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', biz.id);
  const products = (productsData as Product[] | null) ?? [];

  const levelInfo = LEVEL_INFO[biz.verification_level];
  const memberSince = new Date(biz.created_at).getFullYear();
  const locationParts = [biz.city, biz.state].filter(Boolean).join(', ');

  return (
    <>
      <div className="profile-hero">
        <div className="profile-cover" />
        <div className="wrap">
          <div className="profile-head">
            <div className="profile-avatar" aria-hidden="true" />
            <div className="profile-titles">
              <h1>{biz.name}</h1>
              <div className="biz-meta">{biz.category}{locationParts && <> &middot; {locationParts}</>}</div>
            </div>
            <div className="profile-actions">
              <button className="btn btn-outline btn-sm" type="button">Follow</button>
              <button className="btn btn-primary btn-sm" type="button">Message</button>
            </div>
          </div>
        </div>
      </div>

      <section className="profile-body">
        <div className="wrap profile-grid">
          <div>
            <div className="info-card">
              <h3>About</h3>
              {biz.description ? (
                <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.7 }}>{biz.description}</p>
              ) : (
                <div className="empty-state">This business hasn&apos;t added a description yet.</div>
              )}
            </div>

            <div className="info-card">
              <Tabs
                className="tabs"
                tabs={[
                  {
                    key: 'products',
                    label: 'Products',
                    panel:
                      products.length > 0 ? (
                        <div className="card-grid grid-2" style={{ marginTop: 18 }}>
                          {products.map((p, i) => (
                            <Link key={p.slug} href={`/product/${p.slug}`} className="biz-card">
                              <div className={`biz-thumb ${THUMBS[i % THUMBS.length]}`} />
                              <div className="biz-body">
                                <h4>{p.name}</h4>
                                <div className="biz-meta">{formatNaira(p.price_kobo)}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-state" style={{ marginTop: 18 }}>
                          No products listed yet.
                        </div>
                      ),
                  },
                  {
                    key: 'reviews',
                    label: 'Reviews',
                    panel: (
                      <div className="empty-state" style={{ marginTop: 18 }}>
                        No reviews yet. Be the first to share your experience with {biz.name}.
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>

          <div>
            <div className="info-card">
              <div className="min-id-block">
                <Stamp size={36} color="var(--forest-800)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" />
                  </svg>
                </Stamp>
                <div>
                  <div style={{ fontSize: 11.5, color: 'var(--forest-700)', fontFamily: 'var(--font-mono)' }}>
                    MADE IN NIGERIA ID
                  </div>
                  <div className="min-id-code">{biz.min_id ?? 'ID pending'}</div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Verification</h3>
              <div className="verify-row">
                <Badge variant={biz.verification_level === 'registered' ? 'new' : 'verified'}>
                  {levelInfo.label}
                </Badge>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 10 }}>
                {levelInfo.desc}
              </p>
            </div>

            <div className="info-card">
              <h3>Details</h3>
              <div className="hp-row"><span>Category</span><b>{biz.category}</b></div>
              {locationParts && <div className="hp-row"><span>Location</span><b>{locationParts}</b></div>}
              <div className="hp-row"><span>Member since</span><b>{memberSince}</b></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
