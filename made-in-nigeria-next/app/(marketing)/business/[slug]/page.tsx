import { notFound } from 'next/navigation';
import Link from 'next/link';
import Stamp from '@/components/ui/Stamp';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import SaveBusinessButton from '@/components/business/SaveBusinessButton';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Business = Database['public']['Tables']['businesses']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];
type Story = Database['public']['Tables']['stories']['Row'];

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

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  let initiallySaved = false;
  if (currentUser) {
    const { data: savedRow } = await supabase
      .from('saved_businesses')
      .select('id')
      .eq('customer_id', currentUser.id)
      .eq('business_id', biz.id)
      .maybeSingle();
    initiallySaved = !!savedRow;
  }

  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', biz.id);
  const products = (productsData as Product[] | null) ?? [];

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*')
    .eq('business_id', biz.id)
    .order('created_at', { ascending: false });
  const reviews = (reviewsData as Review[] | null) ?? [];

  const { data: storiesData } = await supabase
    .from('stories')
    .select('*')
    .eq('business_id', biz.id)
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(3);
  const stories = (storiesData as Story[] | null) ?? [];

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
              <SaveBusinessButton businessId={biz.id} initiallySaved={initiallySaved} />
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
                    panel:
                      reviews.length > 0 ? (
                        <div style={{ marginTop: 18 }}>
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

      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <div><div className="eyebrow">Founder Stories</div><h2>Stories from {biz.name}</h2></div>
            {stories.length > 0 && <Link href={`/stories?business=${biz.slug}`} className="section-link">View all stories →</Link>}
          </div>
          {stories.length > 0 ? <div className="card-grid grid-3">{stories.map(story => <article className="biz-card" key={story.id}><div className="biz-thumb thumb-2" /><div className="biz-body"><Badge variant={story.featured ? 'trending' : 'verified'}>{story.story_type}</Badge><h4 style={{marginTop:10}}>{story.title}</h4>{story.excerpt && <p style={{fontSize:13,color:'var(--ink-soft)',lineHeight:1.6,marginTop:8}}>{story.excerpt}</p>}<Link href={`/stories/${story.slug}`} className="section-link" style={{marginTop:10,display:'inline-flex'}}>Read story →</Link></div></article>)}</div> : <div className="empty-state">This business has not published a story yet.</div>}
        </div>
      </section>
    </>
  );
}
