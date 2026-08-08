import Link from 'next/link';
import Stamp from '@/components/ui/Stamp';

export const metadata = {
  title: 'Our Story',
};

const CORE_VALUES = [
  {
    icon: <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M10 11a4 4 0 100-8 4 4 0 000 8z" />,
    label: 'We Rise by Lifting Others',
  },
  {
    icon: (
      <>
        <circle cx={12} cy={12} r={9} />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
    label: 'Collaboration Over Competition',
  },
  { icon: <path d="M4 12h16M12 4v16" />, label: 'No Business Left Behind' },
  { icon: <path d="M5 13l4 4L19 7" />, label: 'Trust Before Transactions' },
  {
    icon: <path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" />,
    label: 'Powered by AI. Driven by People.',
  },
];

export default function OurStoryPage() {
  return (
    <>
      {/* ============ PAGE HEADER ============ */}
      <section className="page-header">
        <div className="wrap">
          <div className="eyebrow">Our Story</div>
          <h1>From &quot;Made in China&quot; to Made in Nigeria</h1>
          <p>A movement to change how the world sees — and how Nigerians see — what&apos;s built here.</p>
        </div>
      </section>

      {/* ============ THE RISE OF ABA ============ */}
      <section className="section">
        <div className="wrap why-grid">
          <div>
            <div className="eyebrow">The Rise of Aba</div>
            <h2 style={{ marginTop: 14 }}>
              Every stitched shoe, every woven fabric, started as someone&apos;s proof of skill.
            </h2>
            <p className="section-desc" style={{ marginTop: 18 }}>
              Walk through Aba&apos;s Ariaria Market and you&apos;ll find some of the finest leatherwork
              and tailoring on the continent — made by hand, sold with no platform behind it, and too
              often relabeled as something else by the time it reaches a shelf abroad. That gap between
              the skill in the workshop and the trust in the marketplace is where Made in Nigeria starts.
            </p>
            <p className="section-desc" style={{ marginTop: 14 }}>
              We&apos;re not building another place to list a business. We&apos;re building the system
              that was missing — one that helps a business get discovered, get trusted, and get the
              support it needs to grow past its first sale.
            </p>
          </div>
          <div className="why-visual" aria-hidden="true">
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 24 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--gold-050)', letterSpacing: '.05em' }}>
                ARIARIA MARKET · ABA, ABIA STATE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MISSION / VISION / PRINCIPLE / PROMISE ============ */}
      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Our Dream</div>
              <h2>A trusted ecosystem, not another marketplace</h2>
            </div>
          </div>
          <div className="card-grid">
            <div className="biz-card">
              <div className="biz-body">
                <h4>Mission</h4>
                <p className="biz-meta" style={{ marginTop: 10, lineHeight: 1.6 }}>
                  Empower Nigerian businesses by making them easy to discover, trust, and support through
                  technology, storytelling, and AI.
                </p>
              </div>
            </div>
            <div className="biz-card">
              <div className="biz-body">
                <h4>Vision</h4>
                <p className="biz-meta" style={{ marginTop: 10, lineHeight: 1.6 }}>
                  Africa&apos;s Business Growth Ecosystem — the trusted bridge between Nigerian businesses
                  and the world.
                </p>
              </div>
            </div>
            <div className="biz-card">
              <div className="biz-body">
                <h4>Core Principle</h4>
                <p className="biz-meta" style={{ marginTop: 10, lineHeight: 1.6 }}>
                  We don&apos;t just list businesses. We help businesses grow.
                </p>
              </div>
            </div>
            <div className="biz-card">
              <div className="biz-body">
                <h4>Promise</h4>
                <p className="biz-meta" style={{ marginTop: 10, lineHeight: 1.6 }}>
                  Making business easy and smart — for the roadside tailor and the export-ready
                  manufacturer alike.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CORE VALUES ============ */}
      <section className="section">
        <div className="wrap">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Core Values</div>
          <h2 style={{ textAlign: 'center', marginTop: 14, maxWidth: 'none' }}>
            What every decision on this platform answers to
          </h2>
          <div className="pillars" style={{ maxWidth: 720, margin: '36px auto 0' }}>
            {CORE_VALUES.map((value) => (
              <div className="pillar" key={value.label}>
                <Stamp>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    {value.icon}
                  </svg>
                </Stamp>
                <div>
                  <h4>{value.label}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ JOIN THE MOVEMENT CTA ============ */}
      <section className="section">
        <div className="wrap">
          <div className="banner">
            <div className="banner-inner" style={{ maxWidth: 560 }}>
              <div className="eyebrow hero-eyebrow">Join the Movement</div>
              <h3>No business builds alone. Yours doesn&apos;t have to either.</h3>
              <p>
                Register your business, or become a Builder who helps others grow. Every role
                strengthens the ecosystem.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link href="/auth?role=business" className="btn btn-gold">Register Your Business</Link>
                <Link href="/marketplace" className="btn btn-outline-light">Explore the Marketplace</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
