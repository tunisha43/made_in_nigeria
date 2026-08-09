import { notFound } from 'next/navigation';
import Link from 'next/link';
import Stamp from '@/components/ui/Stamp';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';

// Placeholder lookup standing in for:
//   supabase.from('businesses').select('*').eq('slug', slug).single()
// Only one business exists for now (Adaeze Textiles) -- every business card
// across the site links here via /business/[slug], so this table grows as
// more example businesses get ported, and gets replaced entirely once
// Supabase is wired up.
const BUSINESSES = {
  'adaeze-textiles': {
    name: 'Adaeze Textiles',
    category: 'Textiles & Fashion Manufacturer',
    location: 'Aba, Abia State',
    minId: 'MIN-NG-00004582',
    about:
      "Adaeze Textiles hand-weaves and tailors Ankara, Adire, and Aso-Oke pieces from a workshop in Aba's Ariaria Market district. Founded in 2019, the business now supplies both local customers and export-ready wholesale orders. Every piece is dyed and finished in-house.",
    founderStory:
      '"I started with one sewing machine and fabric from my mother\'s stall. Made in Nigeria helped buyers outside Aba find me for the first time -- without a middleman changing my prices." -- Adaeze, Founder',
    memberSince: '2024',
    teamSize: '4 people',
    products: [
      { slug: 'ankara-wrap-set', thumb: 'thumb-3', name: 'Ankara Wrap Set', price: '₦18,500' },
      { slug: 'adire-table-runner', thumb: 'thumb-1', name: 'Adire Table Runner', price: '₦11,000' },
    ],
    verification: [
      { label: 'Identity verified -- Advanced', met: true },
      { label: 'Physical location confirmed', met: true },
      { label: 'Business registration on file', met: true },
      { label: 'Export documentation -- pending', met: false },
    ],
  },
} as const;

type BusinessSlug = keyof typeof BUSINESSES;

export function generateStaticParams() {
  return Object.keys(BUSINESSES).map((slug) => ({ slug }));
}

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = BUSINESSES[slug as BusinessSlug];
  if (!business) notFound();

  const CheckStamp = ({ met }: { met: boolean }) => (
    <span
      className="stamp"
      style={{ ['--sz' as string]: '22px', color: met ? 'var(--forest-800)' : 'var(--line)' }}
      aria-hidden="true"
    >
      {met && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
  );

  return (
    <>
      <div className="profile-hero">
        <div className="profile-cover" />
        <div className="wrap">
          <div className="profile-head">
            <div className="profile-avatar" aria-hidden="true" />
            <div className="profile-titles">
              <h1>{business.name}</h1>
              <div className="biz-meta">{business.category} &middot; {business.location}</div>
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
              <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.7 }}>{business.about}</p>
            </div>

            <div className="info-card">
              <Tabs
                className="tabs"
                tabs={[
                  {
                    key: 'products',
                    label: 'Products',
                    panel: (
                      <div className="card-grid grid-2" style={{ marginTop: 18 }}>
                        {business.products.map((p) => (
                          <Link key={p.slug} href={`/product/${p.slug}`} className="biz-card">
                            <div className={`biz-thumb ${p.thumb}`}>
                              <Badge variant="trending">Export-Ready</Badge>
                            </div>
                            <div className="biz-body">
                              <h4>{p.name}</h4>
                              <div className="biz-meta">{p.price}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ),
                  },
                  {
                    key: 'reviews',
                    label: 'Reviews',
                    panel: (
                      <div className="empty-state" style={{ marginTop: 18 }}>
                        No reviews yet. Be the first to share your experience with {business.name}.
                      </div>
                    ),
                  },
                  {
                    key: 'story',
                    label: 'Founder Story',
                    panel: (
                      <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.7, marginTop: 18 }}>
                        {business.founderStory}
                      </p>
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
                  <div className="min-id-code">{business.minId}</div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Verification</h3>
              {business.verification.map((v) => (
                <div className="verify-row" key={v.label} style={!v.met ? { color: 'var(--ink-soft)' } : undefined}>
                  <CheckStamp met={v.met} /> {v.label}
                </div>
              ))}
            </div>

            <div className="info-card">
              <h3>Details</h3>
              <div className="hp-row"><span>Category</span><b>{business.category}</b></div>
              <div className="hp-row"><span>Location</span><b>{business.location}</b></div>
              <div className="hp-row"><span>Member since</span><b>{business.memberSince}</b></div>
              <div className="hp-row"><span>Team size</span><b>{business.teamSize}</b></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
