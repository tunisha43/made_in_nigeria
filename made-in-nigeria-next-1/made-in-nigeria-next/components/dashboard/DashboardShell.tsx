import Link from 'next/link';
import { ReactNode } from 'react';
import SignOutButton from '@/components/auth/SignOutButton';

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: ReactNode; // inline <svg>...</svg>
  active?: boolean;
}

export interface DashboardNavSection {
  label: string;
  items: DashboardNavItem[];
}

interface DashboardShellProps {
  navSections: DashboardNavSection[];
  signedInAs: string;
  signedInSubtext: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  children: ReactNode;
}

/**
 * Shared sidebar + topbar app shell for every dashboard-style page:
 * /dashboard (business), /account (customer), /investor-hub, /admin.
 * A pure Server Component -- active nav state is passed in explicitly per
 * page via `active: true` on the relevant item, rather than detected with
 * usePathname(), so this never needs 'use client'.
 */
export default function DashboardShell({
  navSections,
  signedInAs,
  signedInSubtext,
  welcomeTitle,
  welcomeSubtitle,
  children,
}: DashboardShellProps) {
  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <Link href="/" className="logo">
          <span className="script">Made in</span>
          <span className="bold">NIGERIA</span>
        </Link>

        {navSections.map((section) => (
          <div key={section.label}>
            <div className="dash-nav-label">{section.label}</div>
            {section.items.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={`dash-nav-item${item.active ? ' is-active' : ''}`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="dash-sidebar-foot">
          Signed in as {signedInAs}
          <br />
          {signedInSubtext}
          <div style={{ marginTop: 10 }}>
            <SignOutButton />
          </div>
        </div>
      </aside>

      <div>
        <div className="dash-topbar">
          <div className="dash-welcome">
            <h1>{welcomeTitle}</h1>
            <p>{welcomeSubtitle}</p>
          </div>
          <div className="dash-topbar-right">
            <button className="icon-btn" aria-label="Notifications" type="button">
              <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 01-3.4 0" />
              </svg>
              <span className="dot" />
            </button>
            <button className="icon-btn" aria-label="Settings" type="button">
              <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={12} cy={12} r={3} />
                <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
              </svg>
            </button>
            <div className="dash-avatar" aria-hidden="true" />
          </div>
        </div>

        <main className="dash-main">
          <div className="dash-grid">{children}</div>
        </main>
      </div>
    </div>
  );
}
