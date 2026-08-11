'use client';

import { useState } from 'react';
import Link from 'next/link';
import BizCard from '@/components/ui/BizCard';
import Badge from '@/components/ui/Badge';
import Stamp from '@/components/ui/Stamp';
import type { Database } from '@/types/database';

type Business = Database['public']['Tables']['businesses']['Row'];

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'verified', label: 'Verified' },
  { key: 'trending', label: 'Trending' },
  { key: 'new', label: 'New' },
  { key: 'top', label: 'Top Rated' },
] as const;

// Cosmetic-only rotation across the 6 placeholder gradient thumbnails, since
// no real business photos exist yet (Supabase Storage isn't wired up).
const THUMBS = ['thumb-1', 'thumb-2', 'thumb-3', 'thumb-4', 'thumb-5', 'thumb-6'];

function CheckOrPlusIcon({ verified }: { verified: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      {verified ? <path d="M5 13l4 4L19 7" /> : <path d="M12 8v8M8 12h8" />}
    </svg>
  );
}

function BusinessCard({ business, index }: { business: Business; index: number }) {
  const isVerified = business.verification_level !== 'registered';
  const locationParts = [business.city, business.state].filter(Boolean).join(', ');

  return (
    <BizCard
      href={`/business/${business.slug}`}
      thumbClassName={THUMBS[index % THUMBS.length]}
      badge={
        <Badge variant={isVerified ? 'verified' : 'new'}>
          {business.verification_level === 'advanced_verified'
            ? 'Advanced Verified'
            : business.verification_level === 'verified'
            ? 'Verified'
            : 'Registered'}
        </Badge>
      }
      title={business.name}
      meta={locationParts ? `${business.category} · ${locationParts}` : business.category}
      footer={
        <div className="biz-foot">
          <span>{business.min_id ?? 'ID pending'}</span>
          <Stamp size={26}>
            <CheckOrPlusIcon verified={isVerified} />
          </Stamp>
        </div>
      }
    />
  );
}

interface MarketplaceResultsProps {
  businesses: Business[];
}

export default function MarketplaceResults({ businesses }: MarketplaceResultsProps) {
  const [active, setActive] = useState<(typeof TABS)[number]['key']>('all');

  const verifiedBusinesses = businesses.filter((b) => b.verification_level !== 'registered');
  const newestFirst = [...businesses].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const visibleList =
    active === 'all' ? businesses : active === 'verified' ? verifiedBusinesses : active === 'new' ? newestFirst : [];

  const showEmptyMessage = active === 'trending' || active === 'top' || visibleList.length === 0;

  function emptyMessage(): string {
    if (active === 'trending') {
      return 'Not enough real activity data yet to show a Trending list. This will populate honestly once usage data exists.';
    }
    if (active === 'top') {
      return 'No reviews yet — Top Rated will populate once real customer reviews come in.';
    }
    if (active === 'verified' && businesses.length > 0) {
      return 'No Verified or Advanced Verified businesses yet — check back as more complete verification.';
    }
    return 'No businesses have registered yet. Be the first to list one.';
  }

  return (
    <>
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
          {!showEmptyMessage ? `${visibleList.length} business${visibleList.length === 1 ? '' : 'es'} shown` : ''}
        </span>
      </div>

      {showEmptyMessage ? (
        <div className="empty-state">
          {emptyMessage()}
          {(active === 'all' || active === 'verified') && businesses.length === 0 && (
            <>
              {' '}
              <Link href="/auth?role=business" className="link-gold">List your business →</Link>
            </>
          )}
        </div>
      ) : (
        <div className="card-grid">
          {visibleList.map((business, i) => (
            <BusinessCard business={business} index={i} key={business.id} />
          ))}
        </div>
      )}
    </>
  );
}
