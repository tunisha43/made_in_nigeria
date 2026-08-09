import Badge from '@/components/ui/Badge';
import DashboardShell, { DashboardNavSection } from '@/components/dashboard/DashboardShell';

export const metadata = {
  title: 'My Account',
};

const NAV: DashboardNavSection[] = [
  {
    label: 'My Account',
    items: [
      { href: '/account', label: 'Overview', active: true, icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={3} y={3} width={7} height={9} rx={1.5} /><rect x={14} y={3} width={7} height={5} rx={1.5} /><rect x={14} y={12} width={7} height={9} rx={1.5} /><rect x={3} y={16} width={7} height={5} rx={1.5} /></svg>
      ) },
      { href: '#', label: 'Orders', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2l1.5 5H3l4 4-1.5 6L12 14l6.5 3L17 11l4-4h-4.5L15 2H9L6 2z" /></svg>
      ) },
      { href: '#', label: 'Wishlist', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20.8 4.6c-1.9-1.9-5-1.9-6.9 0L12 6.5l-1.9-1.9c-1.9-1.9-5-1.9-6.9 0-1.9 1.9-1.9 5 0 6.9L12 20.3l8.8-8.8c1.9-1.9 1.9-5 0-6.9z" /></svg>
      ) },
      { href: '#', label: 'Saved Businesses', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" /></svg>
      ) },
      { href: '#', label: 'My Reviews', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" /></svg>
      ) },
      { href: '#', label: 'Settings', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={3} /><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></svg>
      ) },
    ],
  },
];

const WISHLIST = [
  { slug: 'ankara-wrap-set', thumb: 'thumb-3', badge: 'trending' as const, badgeLabel: 'Export-Ready', name: 'Ankara Wrap Set', price: '₦18,500' },
  { slug: 'adire-table-runner', thumb: 'thumb-1', badge: 'trending' as const, badgeLabel: 'Export-Ready', name: 'Adire Table Runner', price: '₦11,000' },
  { slug: 'aso-oke-headwrap', thumb: 'thumb-6', badge: 'new' as const, badgeLabel: 'New', name: 'Aso-Oke Headwrap', price: '₦7,500' },
  { slug: 'adire-throw-pillow', thumb: 'thumb-5', badge: 'verified' as const, badgeLabel: 'Verified', name: 'Adire Throw Pillow', price: '₦6,200' },
];

export default function CustomerDashboardPage() {
  return (
    <DashboardShell
      navSections={NAV}
      signedInAs="Chika Okonkwo"
      signedInSubtext="chika.o@email.com"
      welcomeTitle="Welcome back, Chika."
      welcomeSubtitle="Here's what's happening with your account."
    >
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>In Transit</h3></div>
        <div className="figure">2</div>
        <div className="delta delta-flat">1 arriving this week</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Delivered</h3></div>
        <div className="figure">14</div>
        <div className="delta delta-up">Since joining</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Wishlist</h3></div>
        <div className="figure">7</div>
        <div className="delta delta-flat">items saved</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Saved Businesses</h3></div>
        <div className="figure">5</div>
        <div className="delta delta-flat">following</div>
      </div>

      <div className="widget span-4">
        <div className="widget-head"><h3>Recent Orders</h3><span className="w-link">View all</span></div>
        <div className="order-row"><span className="dot-tag"><span className="dot-sm" style={{ background: 'var(--gold-500)' }} />Ankara Wrap Set &middot; Adaeze Textiles</span><b>In Transit &middot; Order #1042</b></div>
        <div className="order-row"><span className="dot-tag"><span className="dot-sm" style={{ background: 'var(--forest-600)' }} />Cold-pressed Palm Oil, 5L &middot; Bayelsa Fresh Farms</span><b>Delivered &middot; Aug 2</b></div>
        <div className="order-row"><span className="dot-tag"><span className="dot-sm" style={{ background: 'var(--forest-600)' }} />Hand-tanned Leather Bag &middot; Okon Leather Works</span><b>Delivered &middot; Jul 24</b></div>
      </div>

      <div className="widget span-4">
        <div className="widget-head"><h3>From Your Wishlist</h3><span className="w-link">View all</span></div>
        <div className="card-grid grid-4">
          {WISHLIST.map((p) => (
            <a href={`/product/${p.slug}`} className="biz-card" key={p.slug}>
              <div className={`biz-thumb ${p.thumb}`}>
                <Badge variant={p.badge}>{p.badgeLabel}</Badge>
              </div>
              <div className="biz-body">
                <h4 style={{ fontSize: 14 }}>{p.name}</h4>
                <div className="biz-meta">{p.price}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Saved Businesses</h3><span className="w-link">Manage</span></div>
        <div className="team-row">
          <div className="team-avatar" style={{ background: 'var(--forest-700)' }}>AT</div>
          <div><div className="name">Adaeze Textiles</div><div className="act">Aba, Abia &middot; Verified</div></div>
        </div>
        <div className="team-row">
          <div className="team-avatar" style={{ background: 'var(--clay)' }}>BF</div>
          <div><div className="name">Bayelsa Fresh Farms</div><div className="act">Yenagoa, Bayelsa &middot; Verified</div></div>
        </div>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>My Reviews</h3><span className="w-link">Write a review</span></div>
        <div className="review-mini">
          <div className="stamp" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" /></svg>
          </div>
          <div>
            <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733; &middot; Bayelsa Fresh Farms</div>
            <p>&quot;Palm oil arrived well-packed and fast.&quot;</p>
          </div>
        </div>
        <div className="empty-state" style={{ marginTop: 14 }}>1 delivered order is still waiting on your review.</div>
      </div>
    </DashboardShell>
  );
}
