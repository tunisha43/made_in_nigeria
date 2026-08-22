import Stamp from '@/components/ui/Stamp';
import Tabs from '@/components/ui/Tabs';

export const metadata = {
  title: 'National & Government Hub',
};

const GRANTS = [
  { name: 'Bank of Industry — MSME Fund', desc: 'Low-interest loans for registered small manufacturers and processors.', deadline: 'Rolling' },
  { name: 'NEXIM Export Development Fund', desc: 'Support for businesses preparing their first export shipment.', deadline: 'Sep 30' },
  { name: 'Bayelsa State SME Grant', desc: 'State-level grant for Verified businesses registered in Bayelsa.', deadline: 'Aug 31' },
];

const EXPORT_OPPORTUNITIES = [
  { name: 'UK-Nigeria Trade Corridor', desc: 'Buyer-matching program for textiles and handmade goods exporters.' },
  { name: 'ECOWAS Regional Trade Fair', desc: 'Booth space for Verified manufacturers, subsidized for first-time exhibitors.' },
  { name: 'Diaspora Buyer Network', desc: 'Direct introductions to Nigerian diaspora buyers in the UK, US, and Canada.' },
];

export default function NationalHubPage() {
  return (
    <>
      <section className="page-header">
        <div className="wrap">
          <div className="eyebrow">National & Government Hub</div>
          <h1>Where Nigerian business meets national opportunity</h1>
          <p>
            See where businesses are building across the country, find grants and export programs,
            and track the sectors driving real growth — all in one place.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap why-grid">
          <div className="map-visual" aria-hidden="true">
            <div className="map-legend"><span><span className="map-dot" /> Active business clusters</span></div>
          </div>
          <div>
            <div className="eyebrow">Business Map</div>
            <h2 style={{ marginTop: 14 }}>Bayelsa today. Every state, eventually.</h2>
            <p className="section-desc" style={{ marginTop: 14 }}>
              Made in Nigeria is currently live in Bayelsa State as a focused pilot before expanding
              nationally — real verification takes real time on the ground, state by state.
            </p>
            <div className="pillars">
              <div className="pillar">
                <Stamp>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" /></svg>
                </Stamp>
                <div><h4>Bayelsa State — Pilot</h4><p>Active onboarding and verification underway.</p></div>
              </div>
              <div className="pillar">
                <Stamp>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 8v8M8 12h8" /></svg>
                </Stamp>
                <div><h4>Abia, Rivers, Lagos, Akwa Ibom, Enugu</h4><p>Early businesses registered ahead of formal state rollout.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Grants & Export Marketplace</div>
              <h2>Funding and market access, in one list</h2>
            </div>
          </div>

          <Tabs
            tabs={[
              {
                key: 'grants',
                label: 'Grants',
                panel: (
                  <div className="card-grid grid-3">
                    {GRANTS.map((g) => (
                      <div className="info-card" style={{ marginBottom: 0 }} key={g.name}>
                        <h3 style={{ fontSize: 15 }}>{g.name}</h3>
                        <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{g.desc}</p>
                        <div className="hp-row" style={{ borderTop: 'none', paddingTop: 14 }}>
                          <span>Deadline</span><b>{g.deadline}</b>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                key: 'export',
                label: 'Export Opportunities',
                panel: (
                  <div className="card-grid grid-3">
                    {EXPORT_OPPORTUNITIES.map((e) => (
                      <div className="info-card" style={{ marginBottom: 0 }} key={e.name}>
                        <h3 style={{ fontSize: 15 }}>{e.name}</h3>
                        <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{e.desc}</p>
                      </div>
                    ))}
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
              <div className="eyebrow">Economic Intelligence</div>
              <h2>What&apos;s actually growing right now</h2>
            </div>
          </div>
          <div className="stats-grid grid-4">
            <div className="stat-cell"><div className="stat-num">Agriculture</div><div className="stat-label">Fastest-growing sector this quarter</div></div>
            <div className="stat-cell"><div className="stat-num">Textiles</div><div className="stat-label">Highest export interest</div></div>
            <div className="stat-cell"><div className="stat-num">Bayelsa</div><div className="stat-label">Most active pilot state</div></div>
            <div className="stat-cell"><div className="stat-num">+</div><div className="stat-label">New registrations — growing daily</div></div>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 16 }}>
            Figures reflect real platform activity and update as more businesses join — nothing here
            is projected or estimated.
          </p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div className="banner">
            <div className="banner-inner">
              <div className="eyebrow hero-eyebrow">For Government & Partners</div>
              <h3>Looking to reach verified Nigerian businesses at scale?</h3>
              <p>
                Government agencies and development partners can reach Made in Nigeria&apos;s
                verified business network directly — for grants, programs, and trade initiatives.
              </p>
              <a href="#" className="btn btn-gold">Partner With Us</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
