import Link from 'next/link';
import DashboardShell, { DashboardNavSection } from '@/components/dashboard/DashboardShell';

export const metadata = {
  title: 'Dashboard',
};

const NAV: DashboardNavSection[] = [
  {
    label: 'Headquarters',
    items: [
      { href: '/dashboard', label: 'Dashboard', active: true, icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={3} y={3} width={7} height={9} rx={1.5} /><rect x={14} y={3} width={7} height={5} rx={1.5} /><rect x={14} y={12} width={7} height={9} rx={1.5} /><rect x={3} y={16} width={7} height={5} rx={1.5} /></svg>
      ) },
      { href: '/business/adaeze-textiles', label: 'Public Profile', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" /></svg>
      ) },
    ],
  },
  {
    label: 'Business',
    items: [
      { href: '#', label: 'Products', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
      ) },
      { href: '#', label: 'Orders', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2l1.5 5H3l4 4-1.5 6L12 14l6.5 3L17 11l4-4h-4.5L15 2H9L6 2z" /></svg>
      ) },
      { href: '#', label: 'Messages', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
      ) },
      { href: '#', label: 'Analytics', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
      ) },
      { href: '/trust-verification', label: 'Verification', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
      ) },
    ],
  },
  {
    label: 'Grow',
    items: [
      { href: '#', label: 'Team', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={8} r={4} /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>
      ) },
      { href: '#', label: 'AI Coach', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" /></svg>
      ) },
      { href: '/events', label: 'Events', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={3} y={4} width={18} height={17} rx={2} /><path d="M3 9h18M8 2v4M16 2v4" /></svg>
      ) },
    ],
  },
];

export default function BusinessDashboardPage() {
  return (
    <DashboardShell
      navSections={NAV}
      signedInAs="Adaeze Nwosu"
      signedInSubtext="Adaeze Textiles · MIN-NG-00004582"
      welcomeTitle="Welcome, Adaeze."
      welcomeSubtitle="Here's how Adaeze Textiles is doing today."
    >
      <div className="widget span-2">
        <div className="widget-head"><h3>Business Health Score</h3><span className="w-link">Why this score?</span></div>
        <div className="health-score">
          <div className="gauge" style={{ ['--pct' as string]: 92 } as React.CSSProperties}><span className="gauge-num">92%</span></div>
          <p className="health-copy">Strong across verification and response time. <b>Add 3 more product photos</b> to lift your Discovery score this week.</p>
        </div>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Today&apos;s Tasks</h3><span className="w-link">View all</span></div>
        <div className="task-list">
          <div className="task-item done">
            <span className="task-check">
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
            </span>
            <span>Reply to 2 new customer messages</span>
          </div>
          <div className="task-item"><span className="task-check" /><span>Confirm shipment for order #1042</span></div>
          <div className="task-item"><span className="task-check" /><span>Upload export documentation</span></div>
          <div className="task-item"><span className="task-check" /><span>Post this week&apos;s Business Diary entry</span></div>
        </div>
      </div>

      <div className="widget span-3">
        <div className="widget-head"><h3>Weekly Sales / Revenue</h3><span className="w-link">Full report</span></div>
        <div className="rev-figure">&#8358;186,400 <span className="rev-delta">+12% vs last week</span></div>
        <div className="bar-chart">
          {[38, 52, 34, 70, 100, 61, 47].map((h, i) => (
            <div className={`bar${i === 4 ? ' peak' : ''}`} style={{ height: `${h}%` }} key={i}>
              <span style={{ height: '100%' }} />
            </div>
          ))}
        </div>
        <div className="bar-labels">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span key={d}>{d}</span>)}
        </div>
      </div>

      <div className="widget span-1">
        <div className="widget-head"><h3>Ranking</h3></div>
        <div className="rank-badge">
          <div className="rank-num">#3</div>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>of 41 in Textiles &amp; Fashion, Abia State</p>
        </div>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Orders</h3><span className="w-link">Manage</span></div>
        <div className="order-row"><span className="dot-tag"><span className="dot-sm" style={{ background: 'var(--gold-500)' }} />Pending</span><b>4</b></div>
        <div className="order-row"><span className="dot-tag"><span className="dot-sm" style={{ background: 'var(--forest-600)' }} />Processing</span><b>7</b></div>
        <div className="order-row"><span className="dot-tag"><span className="dot-sm" style={{ background: 'var(--clay)' }} />Shipped</span><b>3</b></div>
        <div className="order-row"><span className="dot-tag"><span className="dot-sm" style={{ background: 'var(--ink-soft)' }} />Completed this week</span><b>15</b></div>
      </div>

      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Customers</h3></div>
        <div className="figure">312</div>
        <div className="delta delta-up">+9 this week</div>
        <div className="spark" aria-hidden="true">
          {[40, 55, 35, 70, 60, 85, 100].map((h, i) => (
            <i key={i} style={{ height: `${h}%`, ...(i === 6 ? { background: 'var(--forest-700)' } : {}) }} />
          ))}
        </div>
      </div>

      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Followers</h3></div>
        <div className="figure">548</div>
        <div className="delta delta-up">+21 this week</div>
      </div>

      <div className="widget span-1">
        <div className="widget-head"><h3>Reviews</h3><span className="w-link">All</span></div>
        <div className="review-mini">
          <div className="stamp" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" /></svg>
          </div>
          <div>
            <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733; &middot; Chika O.</div>
            <p>&quot;Fast delivery and the Adire quality was even better than the photos.&quot;</p>
          </div>
        </div>
      </div>

      <div className="widget span-1">
        <div className="widget-head"><h3>Community</h3></div>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          <b style={{ color: 'var(--forest-800)', fontFamily: 'var(--font-mono)' }}>6 Builders</b> are actively
          supporting your business this month through reviews and shares.
        </p>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>AI CEO Suggestions</h3><span className="w-link">Talk to AI</span></div>
        <div className="ai-card">
          <div className="ai-tag">DISCOVERY</div>
          <p>Businesses with 5+ product photos get found 3&times; more often in search. You currently have 2.</p>
        </div>
        <div className="ai-card">
          <div className="ai-tag">PRICING</div>
          <p>Similar verified textile sellers in Abia price wrap sets between &#8358;16,000&ndash;&#8358;21,000. You&apos;re within range.</p>
        </div>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Team Activity</h3><span className="w-link">Manage team</span></div>
        <div className="team-row">
          <div className="team-avatar" style={{ background: 'var(--forest-700)' }}>AD</div>
          <div><div className="name">Adaeze &mdash; Owner</div><div className="act">Updated product photos &middot; 2h ago</div></div>
          <span className="status-dot" style={{ background: 'var(--forest-700)' }} />
        </div>
        <div className="team-row">
          <div className="team-avatar" style={{ background: 'var(--clay)' }}>KE</div>
          <div><div className="name">Kelechi &mdash; Fulfillment</div><div className="act">Marked order #1039 shipped &middot; 5h ago</div></div>
          <span className="status-dot" style={{ background: 'var(--ink-soft)' }} />
        </div>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Savings Progress</h3></div>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Goal: new dyeing equipment</p>
        <div className="progress-track"><div className="progress-fill" style={{ width: '64%' }} /></div>
        <div className="progress-meta"><span>&#8358;128,000 saved</span><span>Goal: &#8358;200,000</span></div>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Investment Readiness</h3><Link href="/investor-hub" className="w-link">Investor Hub</Link></div>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>3 of 5 requirements complete for pitch visibility</p>
        <div className="progress-track"><div className="progress-fill" style={{ width: '60%' }} /></div>
        <div className="progress-meta"><span>Financials, verification done</span><span>Pitch deck pending</span></div>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Upcoming Events</h3><Link href="/events" className="w-link">All events</Link></div>
        <div className="order-row"><span>Aba Textile Makers &mdash; Meetup</span><b style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 12.5 }}>Aug 14</b></div>
        <div className="order-row"><span>Made in Nigeria &mdash; Export Readiness Workshop</span><b style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 12.5 }}>Aug 22</b></div>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Notifications</h3><span className="w-link">Clear all</span></div>
        <div className="notif-item"><span className="notif-dot" /><div><p>Your Advanced Verification was approved.</p><span className="notif-time">3h ago</span></div></div>
        <div className="notif-item"><span className="notif-dot" style={{ background: 'var(--forest-600)' }} /><div><p>Chika O. left a 5-star review.</p><span className="notif-time">1d ago</span></div></div>
        <div className="notif-item"><span className="notif-dot" style={{ background: 'var(--clay)' }} /><div><p>Kelechi joined your team.</p><span className="notif-time">3d ago</span></div></div>
      </div>
    </DashboardShell>
  );
}
