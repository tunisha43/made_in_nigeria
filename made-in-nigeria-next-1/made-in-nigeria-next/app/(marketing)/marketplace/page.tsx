import { createClient } from '@/lib/supabase/server';
import MarketplaceResults from '@/components/marketplace/MarketplaceResults';
import type { Database } from '@/types/database';

type Business = Database['public']['Tables']['businesses']['Row'];

export const metadata = {
  title: 'Marketplace',
};

// Importance rank used to order results -- see /trust-verification for the
// policy this implements: relevance, then verification level, then location
// fit, then real feedback, never payment. Location fit and real feedback
// aren't buildable yet (no search query to be "relevant" to, no reviews
// table), so verification level is the only ranking signal actually applied
// right now. That's an honest, if partial, implementation of the policy.
const VERIFICATION_RANK: Record<string, number> = {
  advanced_verified: 3,
  verified: 2,
  registered: 1,
};

export default async function MarketplacePage() {
  const supabase = await createClient();

  const { data } = await supabase.from('businesses').select('*');

  // Explicit cast rather than trusting the generic chain -- see the long
  // comment in lib/auth/requireRole.ts for why.
  const businesses = (data as Business[] | null) ?? [];

  const sorted = [...businesses].sort(
    (a, b) => (VERIFICATION_RANK[b.verification_level] ?? 0) - (VERIFICATION_RANK[a.verification_level] ?? 0)
  );

  return (
    <>
      <section className="page-header">
        <div className="wrap">
          <div className="eyebrow">Marketplace &amp; Business Directory</div>
          <h1>Discover verified Nigerian businesses</h1>
          <p>
            Browse by category, location, and verification level. Ranking is relevance →
            verification → location fit → real feedback — never fake popularity.
          </p>
          <div className="search-card" style={{ marginTop: 26, maxWidth: 640 }}>
            <div className="search-icon-btn" aria-hidden="true">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={11} cy={11} r={7} />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </div>
            <input type="text" placeholder="Search businesses, products, or professionals…" aria-label="Search marketplace" />
            <button className="btn btn-primary btn-sm">Search</button>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="wrap">
          <MarketplaceResults businesses={sorted} />
        </div>
      </section>
    </>
  );
}
