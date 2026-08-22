import Link from 'next/link';
import Stamp from '@/components/ui/Stamp';

export const metadata = {
  title: 'Trust & Verification Centre',
};

const LEVELS = [
  {
    color: 'var(--ink-soft)',
    icon: <path d="M12 8v8M8 12h8" />,
    title: 'Registered',
    desc: 'Basic details submitted: business name, location, category, description. Visible on the platform, not yet verified.',
  },
  {
    color: 'var(--forest-800)',
    icon: <path d="M5 13l4 4L19 7" />,
    title: 'Verified',
    desc: 'Identity confirmed and physical location checked. Business registration document on file with Made in Nigeria.',
  },
  {
    color: 'var(--gold-600)',
    icon: <path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" />,
    title: 'Advanced Verified',
    desc: 'Everything in Verified, plus financial history review and consistent fulfillment record. Eligible for featured placement.',
  },
];

const RANKING_FACTORS = [
  { icon: <><circle cx={11} cy={11} r={7} /><path d="M21 21l-4.3-4.3" /></>, title: 'Relevance first', desc: 'How closely a business or product matches what was searched.' },
  { icon: <path d="M5 13l4 4L19 7" />, title: 'Verification level', desc: 'Verified and Advanced Verified businesses rank above Registered — never the reverse.' },
  { icon: <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />, title: 'Location fit', desc: 'Distance and delivery reach relative to the person searching.' },
  { icon: <path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" />, title: 'Real feedback', desc: 'Genuine review history — never a paid or fabricated boost.' },
];

const DATA_TRACKED = [
  { label: 'Verification documents', desc: 'Used only to confirm identity and location — never sold or shared.' },
  { label: 'Order & review history', desc: 'Powers your Health Score and search relevance — computed, not self-reported.' },
  { label: 'Contact details', desc: 'Visible to logged-in users only, never scraped or exported in bulk.' },
];

export default function TrustVerificationPage() {
  return (
    <>
      <section className="page-header">
        <div className="wrap">
          <div className="eyebrow">Trust & Verification Centre</div>
          <h1>How trust works on Made in Nigeria</h1>
          <p>
            Every badge you see means something specific and earned. Here&apos;s exactly what each
            level checks, and how ranking and recommendations really work — no black box.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Verification Levels</div>
              <h2>Three levels, each one checked — not assumed</h2>
            </div>
          </div>
          <div className="card-grid grid-3">
            {LEVELS.map((level) => (
              <div className="info-card" key={level.title}>
                <Stamp color={level.color} style={{ marginBottom: 14 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>{level.icon}</svg>
                </Stamp>
                <h3>{level.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 10 }}>
                  {level.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap why-grid">
          <div>
            <div className="eyebrow">How Ranking Works</div>
            <h2 style={{ marginTop: 14 }}>Never bought, never faked</h2>
            <div className="pillars">
              {RANKING_FACTORS.map((f) => (
                <div className="pillar" key={f.title}>
                  <Stamp>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>{f.icon}</svg>
                  </Stamp>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="why-visual" aria-hidden="true">
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'end', padding: 24 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gold-050)', letterSpacing: '.05em' }}>
                NO BUSINESS IS EVER PAID INTO A HIGHER RANK
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Data Transparency</div>
              <h2>What we track, and why</h2>
            </div>
          </div>
          <div className="info-card" style={{ maxWidth: 760 }}>
            {DATA_TRACKED.map((item) => (
              <div className="verify-row" key={item.label}>
                <span style={{ fontWeight: 600 }}>{item.label}</span>
                <span style={{ color: 'var(--ink-soft)', fontSize: 13 }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div className="banner">
            <div className="banner-inner">
              <div className="eyebrow hero-eyebrow">Ready to earn your badge?</div>
              <h3>Verification starts the moment you register.</h3>
              <p>
                List your business and start moving from Registered toward Verified — every step is
                checked, never assumed.
              </p>
              <Link href="/auth?role=business" className="btn btn-gold">List Your Business</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
