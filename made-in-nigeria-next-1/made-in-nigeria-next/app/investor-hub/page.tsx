import Badge from '@/components/ui/Badge';
import DashboardShell, { DashboardNavSection } from '@/components/dashboard/DashboardShell';

export const metadata = {
  title: 'Investor Hub',
};

const NAV: DashboardNavSection[] = [
  {
    label: 'Investor Hub',
    items: [
      { href: '/investor-hub', label: 'Portfolio', active: true, icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={3} y={3} width={7} height={9} rx={1.5} /><rect x={14} y={3} width={7} height={5} rx={1.5} /><rect x={14} y={12} width={7} height={9} rx={1.5} /><rect x={3} y={16} width={7} height={5} rx={1.5} /></svg>
      ) },
      { href: '#', label: 'Opportunities', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" /></svg>
      ) },
      { href: '#', label: 'Agreements & Escrow', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
      ) },
      { href: '#', label: 'Wealth Planner', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
      ) },
      { href: '#', label: 'Messages', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
      ) },
    ],
  },
];

const PORTFOLIO = [
  { name: 'Adaeze Textiles', sector: 'Textiles & Fashion', dot: 'var(--forest-700)', returnLabel: '+22% · ₦850K', color: 'var(--forest-700)' },
  { name: 'Bayelsa Fresh Farms', sector: 'Agriculture', dot: 'var(--forest-700)', returnLabel: '+14% · ₦1.1M', color: 'var(--forest-700)' },
  { name: 'Okon Leather Works', sector: 'Manufacturing', dot: 'var(--gold-500)', returnLabel: '+3% · ₦600K', color: 'var(--ink-soft)' },
  { name: 'Ekene Woodcraft', sector: 'Furniture', dot: 'var(--clay)', returnLabel: 'Newly funded · ₦450K', color: 'var(--ink-soft)' },
];

const OPPORTUNITIES = [
  { name: 'Uduak Beads & Craft', meta: 'Handmade Goods · Uyo', badge: 'verified' as const, badgeLabel: 'Verified', desc: 'Seeking working capital to fulfil a wholesale export order.', pct: 45, ask: 'Seeking ₦500,000 · 45% committed' },
  { name: "Josephine's Kitchen Co.", meta: 'Food & Catering · Lagos', badge: 'verified' as const, badgeLabel: 'Verified', desc: 'Expanding into a second commercial kitchen location.', pct: 70, ask: 'Seeking ₦900,000 · 70% committed' },
  { name: 'Ekene Woodcraft', meta: 'Furniture & Carpentry · Enugu', badge: 'new' as const, badgeLabel: 'Registered', desc: 'New workshop equipment to increase order capacity.', pct: 20, ask: 'Seeking ₦350,000 · 20% committed' },
];

export default function InvestorHubPage() {
  return (
    <DashboardShell
      navSections={NAV}
      signedInAs="Emeka Obi"
      signedInSubtext="Investor · Sponsor tier"
      welcomeTitle="Welcome, Emeka."
      welcomeSubtitle="Here's how your portfolio is performing."
    >
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Total Invested</h3></div>
        <div className="figure">&#8358;4.2M</div>
        <div className="delta delta-flat">Across 6 businesses</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Portfolio Value</h3></div>
        <div className="figure">&#8358;4.9M</div>
        <div className="delta delta-up">+16.7% overall</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Active Sponsorships</h3></div>
        <div className="figure">3</div>
        <div className="delta delta-flat">Ongoing this quarter</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Escrow Balance</h3></div>
        <div className="figure">&#8358;640K</div>
        <div className="delta delta-flat">Held pending milestones</div>
      </div>

      <div className="widget span-4">
        <div className="widget-head"><h3>Your Portfolio</h3><span className="w-link">Full report</span></div>
        {PORTFOLIO.map((p) => (
          <div className="order-row" key={p.name}>
            <span className="dot-tag"><span className="dot-sm" style={{ background: p.dot }} />{p.name} &mdash; {p.sector}</span>
            <b style={{ color: p.color }}>{p.returnLabel}</b>
          </div>
        ))}
      </div>

      <div className="widget span-4">
        <div className="widget-head"><h3>Opportunities Matching Your Interests</h3><span className="w-link">Browse all</span></div>
        <div className="card-grid grid-3">
          {OPPORTUNITIES.map((o) => (
            <div className="opp-card" key={o.name}>
              <div className="opp-head">
                <div><h4>{o.name}</h4><div className="opp-meta">{o.meta}</div></div>
                <Badge variant={o.badge}>{o.badgeLabel}</Badge>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{o.desc}</p>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${o.pct}%` }} /></div>
              <div className="opp-ask">{o.ask}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Agreements &amp; Escrow</h3><span className="w-link">Manage</span></div>
        <div className="order-row"><span>Adaeze Textiles &mdash; Milestone 2</span><b style={{ color: 'var(--forest-700)' }}>Released</b></div>
        <div className="order-row"><span>Bayelsa Fresh Farms &mdash; Milestone 1</span><b style={{ color: 'var(--gold-600)' }}>Pending review</b></div>
        <div className="order-row"><span>Okon Leather Works &mdash; Signing</span><b style={{ color: 'var(--ink-soft)' }}>Awaiting signature</b></div>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Wealth Planner</h3><span className="w-link">Open planner</span></div>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Annual sponsorship target</p>
        <div className="progress-track"><div className="progress-fill" style={{ width: '58%' }} /></div>
        <div className="progress-meta"><span>&#8358;4.2M deployed</span><span>Goal: &#8358;7.2M</span></div>
      </div>
    </DashboardShell>
  );
}
