import DashboardShell, { DashboardNavSection } from '@/components/dashboard/DashboardShell';
import { requireRole } from '@/lib/auth/requireRole';

export const metadata = {
  title: 'Admin Overview',
};

const NAV: DashboardNavSection[] = [
  {
    label: 'Admin',
    items: [
      { href: '/admin', label: 'Overview', active: true, icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={3} y={3} width={7} height={9} rx={1.5} /><rect x={14} y={3} width={7} height={5} rx={1.5} /><rect x={14} y={12} width={7} height={9} rx={1.5} /><rect x={3} y={16} width={7} height={5} rx={1.5} /></svg>
      ) },
      { href: '#', label: 'Verification Queue', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
      ) },
      { href: '#', label: 'Users', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={8} r={4} /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>
      ) },
      { href: '#', label: 'Businesses', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" /></svg>
      ) },
      { href: '#', label: 'Flagged Content', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><path d="M12 9v4M12 17h.01" /></svg>
      ) },
      { href: '#', label: 'Platform Reports', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
      ) },
    ],
  },
  {
    label: 'Super Admin',
    items: [
      { href: '#', label: 'Platform Settings', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={3} /><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></svg>
      ) },
      { href: '#', label: 'API & Integrations', icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={4} y={4} width={16} height={16} rx={3} /><path d="M9 9h6v6H9z" /></svg>
      ) },
    ],
  },
];

const VERIFICATION_QUEUE = [
  'Chukwudi Auto Parts — Enugu',
  "Ngozi's Bakery — Port Harcourt",
  'Tunde Fabrication Works — Lagos',
];

export default async function AdminPage() {
  const { profile } = await requireRole(['admin']);

  return (
    <DashboardShell
      navSections={NAV}
      signedInAs={profile.full_name || 'Admin'}
      signedInSubtext="Role: Admin"
      welcomeTitle="Admin Overview"
      welcomeSubtitle="Platform health and pending actions."
    >
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Pending Verification</h3></div>
        <div className="figure">18</div>
        <div className="delta delta-flat">Awaiting review</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>New Registrations</h3></div>
        <div className="figure">7</div>
        <div className="delta delta-up">Today</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Flagged Content</h3></div>
        <div className="figure">3</div>
        <div className="delta delta-flat">Needs review</div>
      </div>
      <div className="widget span-1 stat-widget">
        <div className="widget-head"><h3>Active Users</h3></div>
        <div className="figure">1,204</div>
        <div className="delta delta-up">+42 this week</div>
      </div>

      <div className="widget span-4">
        <div className="widget-head"><h3>Verification Queue</h3><span className="w-link">View all</span></div>
        {VERIFICATION_QUEUE.map((name) => (
          <div className="order-row" key={name}>
            <span className="dot-tag"><span className="dot-sm" style={{ background: 'var(--gold-500)' }} />{name}</span>
            <span style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm" type="button">Review</button>
              <button className="btn btn-primary btn-sm" type="button">Approve</button>
            </span>
          </div>
        ))}
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Flagged Content</h3><span className="w-link">Moderation log</span></div>
        <div className="notif-item"><span className="notif-dot" style={{ background: 'var(--clay)' }} /><div><p>Product listing reported — possible duplicate.</p><span className="notif-time">2h ago</span></div></div>
        <div className="notif-item"><span className="notif-dot" style={{ background: 'var(--clay)' }} /><div><p>Review flagged as spam by 3 users.</p><span className="notif-time">5h ago</span></div></div>
        <div className="notif-item"><span className="notif-dot" style={{ background: 'var(--clay)' }} /><div><p>Business description edited — re-review needed.</p><span className="notif-time">1d ago</span></div></div>
      </div>

      <div className="widget span-2">
        <div className="widget-head"><h3>Recent Admin Activity</h3></div>
        <div className="team-row">
          <div className="team-avatar" style={{ background: 'var(--forest-700)' }}>EA</div>
          <div><div className="name">Ebiye — Approved Adaeze Textiles</div><div className="act">Advanced Verified · 1h ago</div></div>
        </div>
        <div className="team-row">
          <div className="team-avatar" style={{ background: 'var(--clay)' }}>RO</div>
          <div><div className="name">Royal — Updated grant listing</div><div className="act">Bayelsa State SME Grant · 3h ago</div></div>
        </div>
      </div>
    </DashboardShell>
  );
}
