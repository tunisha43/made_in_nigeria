import Link from 'next/link';
import Tabs from '@/components/ui/Tabs';
import Stamp from '@/components/ui/Stamp';
import Badge from '@/components/ui/Badge';
import BizCard from '@/components/ui/BizCard';

// Placeholder data standing in for a real query (e.g. supabase.from('businesses')
// .select().eq('featured', true)) once the database exists.
const FEATURED_BUSINESSES = [
  { id: 'adaeze-textiles', thumb: 'thumb-1', badge: 'verified' as const, name: 'Adaeze Textiles', meta: 'Textiles & Fashion · Aba, Abia', minId: 'MIN-NG-00004582' },
  { id: 'bayelsa-fresh-farms', thumb: 'thumb-2', badge: 'verified' as const, name: 'Bayelsa Fresh Farms', meta: 'Agriculture · Yenagoa, Bayelsa', minId: 'MIN-NG-00003190' },
  { id: 'okon-leather-works', thumb: 'thumb-3', badge: 'new' as const, name: 'Okon Leather Works', meta: 'Manufacturing · Port Harcourt, Rivers', minId: 'MIN-NG-00005011' },
  { id: 'josephines-kitchen', thumb: 'thumb-4', badge: 'verified' as const, name: "Josephine's Kitchen Co.", meta: 'Food & Catering · Lagos', minId: 'MIN-NG-00002247' },
];

const PRODUCTS = [
  { slug: 'ankara-wrap-set', thumb: 'thumb-3', badge: 'trending' as const, badgeLabel: 'Export-Ready', name: 'Ankara Wrap Set', meta: 'Adaeze Textiles · ₦18,500' },
  { slug: 'hand-tanned-leather-bag', thumb: 'thumb-5', badge: 'new' as const, badgeLabel: 'Manufacturer', name: 'Hand-tanned Leather Bag', meta: 'Okon Leather Works · ₦42,000' },
  { slug: 'cold-pressed-palm-oil', thumb: 'thumb-6', badge: 'verified' as const, badgeLabel: 'Verified', name: 'Cold-pressed Palm Oil, 5L', meta: 'Bayelsa Fresh Farms · ₦9,200' },
  { slug: 'adire-table-runner', thumb: 'thumb-1', badge: 'trending' as const, badgeLabel: 'Export-Ready', name: 'Adire Table Runner', meta: 'Adaeze Textiles · ₦11,000' },
];

const PROFESSIONALS = [
  { thumb: 'thumb-2', initials: 'MK', name: 'Mercy Kalu', role: 'Structural Engineer', meta: 'Port Harcourt · Construction & Real Estate' },
  { thumb: 'thumb-3', initials: 'TA', name: 'Tunde Aina', role: 'Brand Designer', meta: 'Lagos · Design & Creative' },
  { thumb: 'thumb-4', initials: 'CO', name: 'Chidi Okafor', role: 'Business Lawyer', meta: 'Abuja · Legal & Compliance' },
  { thumb: 'thumb-6', initials: 'FN', name: 'Faith Nwosu', role: 'Accountant', meta: 'Yenagoa · Finance & Tax' },
];

export default function HomePage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow hero-eyebrow">Africa&apos;s Business Growth Ecosystem</div>
            <h1>
              Building Nigeria&apos;s smartest <em>AI-powered</em> business ecosystem
            </h1>
            <p className="hero-sub">
              Discover authentic Nigerian businesses, connect with professionals and manufacturers,
              and grow with AI support built for the way Nigeria actually does business — from Aba
              to Lagos to the diaspora.
            </p>
            <div className="hero-actions">
              <Link href="/marketplace" className="btn btn-gold">Explore Businesses</Link>
              <Link href="#ai-search" className="btn btn-outline-light">Talk to AI</Link>
              <Link href="/auth?role=business" className="btn btn-outline-light">Register Your Business</Link>
            </div>
            <div className="hero-trustline">
              <Stamp>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7" /></svg>
              </Stamp>
              <span>Real businesses. Real verification. No fabricated numbers — ever.</span>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-head">
              <div>
                <div className="eyebrow" style={{ marginBottom: 4 }}>Digital business passport</div>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: 19 }}>Adaeze Textiles</strong>
              </div>
              <Stamp>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" /></svg>
              </Stamp>
            </div>
            <div className="hp-row"><span>Made in Nigeria ID</span><span className="hp-id">MIN-NG-00004582</span></div>
            <div className="hp-row"><span>Verification level</span><b>Advanced Verified</b></div>
            <div className="hp-row"><span>Location</span><b>Aba, Abia State</b></div>
            <div className="hp-row"><span>Category</span><b>Textiles &amp; Fashion</b></div>
            <div className="hp-row"><span>Member since</span><b>2024</b></div>
          </div>
        </div>
      </section>

      {/* ============ AI SEARCH ============ */}
      <div className="wrap search-wrap" id="ai-search">
        <div className="search-card">
          <div className="search-icon-btn" aria-hidden="true">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={11} cy={11} r={7} /><path d="M21 21l-4.3-4.3" /></svg>
          </div>
          <input type="text" placeholder="Search businesses, products, professionals, or ask a question…" aria-label="Search Made in Nigeria" />
          <button className="search-icon-btn" aria-label="Voice search">
            <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" /><path d="M19 10a7 7 0 01-14 0M12 19v3" /></svg>
          </button>
          <button className="btn btn-primary btn-sm">Search</button>
        </div>
        <div className="search-suggest">
          <button className="chip">Find a tailor in Lagos</button>
          <button className="chip">Grants for agriculture startups</button>
          <button className="chip">Verified leather exporters</button>
          <button className="chip">Mentors for first-time founders</button>
        </div>
      </div>

      {/* ============ STATS ============ */}
      <section className="stats-bar">
        <div className="wrap">
          <div className="stats-grid">
            <div className="stat-cell"><div className="stat-num">＋</div><div className="stat-label">Registered Businesses — growing daily</div></div>
            <div className="stat-cell"><div className="stat-num">＋</div><div className="stat-label">Products Listed — growing daily</div></div>
            <div className="stat-cell"><div className="stat-num">＋</div><div className="stat-label">Professionals — growing daily</div></div>
            <div className="stat-cell"><div className="stat-num">＋</div><div className="stat-label">Manufacturers — growing daily</div></div>
            <div className="stat-cell"><div className="stat-num">1</div><div className="stat-label">Nigerian State Covered — Bayelsa (pilot)</div></div>
          </div>
        </div>
      </section>

      {/* ============ WHY MADE IN NIGERIA ============ */}
      <section className="section">
        <div className="wrap why-grid">
          <div className="why-visual" aria-hidden="true" />
          <div>
            <div className="eyebrow">Why Made in Nigeria</div>
            <h2 style={{ marginTop: 14 }}>
              The Marketplace helps businesses sell. The Business Hub helps businesses succeed.
            </h2>
            <p className="section-desc">
              We&apos;re changing how Nigerian businesses are discovered, trusted, and supported —
              replacing uncertainty with verification, and isolation with a community that shares
              the work of growing.
            </p>
            <div className="pillars">
              <div className="pillar">
                <Stamp><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={9} /><path d="M9 12l2 2 4-4" /></svg></Stamp>
                <div><h4>Trust before transactions</h4><p>Every business earns its verification badge — nothing is assumed.</p></div>
              </div>
              <div className="pillar">
                <Stamp><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 21v-6M12 21V9M20 21V3" /></svg></Stamp>
                <div><h4>Grow with a system, not a storefront</h4><p>AI coaching, health scores, and mentors built into every dashboard.</p></div>
              </div>
              <div className="pillar">
                <Stamp><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M10 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg></Stamp>
                <div><h4>No business builds alone</h4><p>Builders, mentors, and reviewers make growth a shared effort.</p></div>
              </div>
            </div>
            <Link href="/our-story" className="section-link" style={{ marginTop: 26, display: 'inline-flex' }}>
              Read our story
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FEATURED BUSINESSES ============ */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Featured Businesses</div>
              <h2>Verified businesses building the movement</h2>
            </div>
          </div>

          <Tabs
            tabs={[
              { key: 'featured', label: 'Featured' },
              { key: 'verified', label: 'Verified' },
              { key: 'trending', label: 'Trending' },
              { key: 'new', label: 'Newly Added' },
            ]}
          >
            {(active) => {
              if (active === 'featured') {
                return (
                  <div className="card-grid" style={{ marginTop: 24 }}>
                    {FEATURED_BUSINESSES.map((biz) => (
                      <BizCard
                        key={biz.id}
                        href={`/business/${biz.id}`}
                        thumbClassName={biz.thumb}
                        badge={<Badge variant={biz.badge}>{biz.badge === 'new' ? 'Registered' : 'Verified'}</Badge>}
                        title={biz.name}
                        meta={biz.meta}
                        footer={
                          <div className="biz-foot">
                            <span>{biz.minId}</span>
                            <Stamp size={26}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7" /></svg>
                            </Stamp>
                          </div>
                        }
                      />
                    ))}
                  </div>
                );
              }
              const emptyCopy: Record<string, string> = {
                verified: 'Filtering by Verified — connect the live database to populate this view with real verified businesses.',
                trending: 'Not enough real activity data yet to show a Trending list. Trending will populate honestly once usage data exists.',
                new: 'Newly added businesses will appear here the moment they complete registration.',
              };
              return <div className="empty-state" style={{ marginTop: 24 }}>{emptyCopy[active]}</div>;
            }}
          </Tabs>
        </div>
      </section>

      {/* ============ PRODUCTS ============ */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Made in Nigeria Products</div>
              <h2>From the workshop to the world</h2>
            </div>
            <Link href="/marketplace" className="section-link">
              Browse marketplace
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
          <div className="card-grid">
            {PRODUCTS.map((p) => (
              <BizCard
                key={p.slug}
                href={`/product/${p.slug}`}
                thumbClassName={p.thumb}
                badge={<Badge variant={p.badge}>{p.badgeLabel}</Badge>}
                title={p.name}
                meta={p.meta}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROFESSIONALS ============ */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Featured Professionals</div>
              <h2>Engineers, designers, and specialists ready to work</h2>
            </div>
          </div>
          <div className="card-grid">
            {PROFESSIONALS.map((person) => (
              <div className="biz-card person-card" key={person.name}>
                <div style={{ padding: '16px 16px 0' }}>
                  <div className={`person-photo ${person.thumb}`}>{person.initials}</div>
                </div>
                <div className="biz-body" style={{ paddingTop: 0 }}>
                  <h4>{person.name}</h4>
                  <div className="person-role">{person.role}</div>
                  <div className="biz-meta">{person.meta}</div>
                  <Link href="#" className="btn btn-outline btn-sm" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RESCUE / CTA ============ */}
      <section className="section">
        <div className="wrap">
          <div className="banner">
            <div className="banner-inner">
              <div className="eyebrow hero-eyebrow">Business Rescue</div>
              <h3>Struggling isn&apos;t the end of the story.</h3>
              <p>
                Business Rescue connects owners going through a hard season with an AI diagnosis, a
                real mentor, and a recovery plan built for their exact situation — supportive,
                never clinical.
              </p>
              <Link href="/auth?role=business" className="btn btn-gold">Get support</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
