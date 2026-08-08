'use client';

import { useState } from 'react';
import BizCard from '@/components/ui/BizCard';
import Badge from '@/components/ui/Badge';
import Stamp from '@/components/ui/Stamp';

// Placeholder data standing in for a real query, e.g.:
//   supabase.from('businesses').select('*').order('verification_level', { ascending: false })
// Ranking policy (relevance -> verification -> location fit -> real feedback,
// never payment) should be enforced server-side once this is a real query --
// see /trust-verification for the policy this implements.
const BUSINESSES = [
  { slug: 'adaeze-textiles', thumb: 'thumb-1', badge: 'verified' as const, badgeLabel: 'Verified', name: 'Adaeze Textiles', meta: 'Textiles & Fashion . Aba, Abia', minId: 'MIN-NG-00004582', checkIcon: true },
  { slug: 'bayelsa-fresh-farms', thumb: 'thumb-2', badge: 'verified' as const, badgeLabel: 'Verified', name: 'Bayelsa Fresh Farms', meta: 'Agriculture . Yenagoa, Bayelsa', minId: 'MIN-NG-00003190', checkIcon: true },
  { slug: 'okon-leather-works', thumb: 'thumb-3', badge: 'new' as const, badgeLabel: 'Registered', name: 'Okon Leather Works', meta: 'Manufacturing . Port Harcourt, Rivers', minId: 'MIN-NG-00005011', checkIcon: false },
  { slug: 'josephines-kitchen', thumb: 'thumb-4', badge: 'verified' as const, badgeLabel: 'Verified', name: "Josephine's Kitchen Co.", meta: 'Food & Catering . Lagos', minId: 'MIN-NG-00002247', checkIcon: true },
  { slug: 'ekene-woodcraft', thumb: 'thumb-5', badge: 'new' as const, badgeLabel: 'Registered', name: 'Ekene Woodcraft', meta: 'Furniture & Carpentry . Enugu', minId: 'MIN-NG-00005204', checkIcon: false },
  { slug: 'uduak-beads-craft', thumb: 'thumb-6', badge: 'verified' as const, badgeLabel: 'Verified', name: 'Uduak Beads & Craft', meta: 'Handmade Goods . Uyo, Akwa Ibom', minId: 'MIN-NG-00001873', checkIcon: true },
];

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'verified', label: 'Verified' },
  { key: 'trending', label: 'Trending' },
  { key: 'new', label: 'New' },
  { key: 'top', label: 'Top Rated' },
] as const;

const EMPTY_COPY: Record<string, string> = {
  verified: 'Filtering by Verified -- connect the live database to populate this view with real verified businesses.',
  trending: 'Not enough real activity data yet to show a Trending list. This will populate honestly once usage data exists.',
  new: 'Newest registrations will appear here as businesses complete onboarding.',
  top: 'No reviews yet -- Top Rated will populate once real customer reviews come in.',
};

function CheckOrPlusIcon({ check }: { check: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      {check ? <path d="M5 13l4 4L19 7" /> : <path d="M12 8v8M8 12h8" />}
    </svg>
  );
}

export default function MarketplacePage() {
  const [active, setActive] = useState<(typeof TABS)[number]['key']>('all');

  return (
    <>
      <section className="page-header">
        <div className="wrap">
          <div className="eyebrow">Marketplace &amp; Business Directory</div>
          <h1>Discover verified Nigerian businesses</h1>
          <p>
            Browse by category, location, and verification level. Ranking is relevance to
            verification to location fit to real feedback -- never fake popularity.
          </p>
          <div className="search-card" style={{ marginTop: 26, maxWidth: 640 }}>
            <div className="search-icon-btn" aria-hidden="true">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={11} cy={11} r={7} />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </div>
            <input type="text" placeholder="Search businesses, products, or professionals..." aria-label="Search marketplace" />
            <button className="btn btn-primary btn-sm">Search</button>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 44 }}>
        <div className="wrap">
          <div className="filter-bar">
            <span className="select-pill">Category: All &#9662;</span>
            <span className="select-pill">State: All Nigeria &#9662;</span>
            <span className="select-pill">Verification: Any &#9662;</span>
            <div className="tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`tab${active === tab.key ? ' is-active' : ''}`}
                  onClick={() => setActive(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <span className="results-count">
              {active === 'all' ? `${BUSINESSES.length} businesses shown` : ''}
            </span>
          </div>

          {active === 'all' ? (
            <div className="card-grid">
              {BUSINESSES.map((biz) => (
                <BizCard
                  key={biz.slug}
                  href={`/business/${biz.slug}`}
                  thumbClassName={biz.thumb}
                  badge={<Badge variant={biz.badge}>{biz.badgeLabel}</Badge>}
                  title={biz.name}
                  meta={biz.meta}
                  footer={
                    <div className="biz-foot">
                      <span>{biz.minId}</span>
                      <Stamp size={26}>
                        <CheckOrPlusIcon check={biz.checkIcon} />
                      </Stamp>
                    </div>
                  }
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">{EMPTY_COPY[active]}</div>
          )}
        </div>
      </section>
    </>
  );
}
