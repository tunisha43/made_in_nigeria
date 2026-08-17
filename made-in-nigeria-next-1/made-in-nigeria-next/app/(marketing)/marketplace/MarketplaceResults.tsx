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

// Same lists RegisterForm restricts business.category/state to, so every
// option here actually matches real data instead of drifting out of sync.
const CATEGORIES = ['Tailoring', 'Farming', 'Cooking', 'Construction', 'Trading', 'Manufacturing', 'Services'];
const STATES = ['Abia', 'Bayelsa', 'Lagos', 'Rivers', 'Akwa Ibom', 'Enugu', 'Other'];

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
  const [category, setCategory] = useState('All');
  const [state, setState] = useState('All Nigeria');
  const [query, setQuery] = useState('');

  function matchesQuery(b: Business): boolean {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      (b.city ?? '').toLowerCase().includes(q) ||
      (b.state ?? '').toLowerCase().includes(q)
    );
  }

  // Category/state/search all apply first, independent of which tab is
  // active -- e.g. "Verified" + "Lagos" + "textile" together means verified
  // textile businesses in Lagos.
  const scoped = businesses.filter(
    (b) => (category === 'All' || b.category === category) && (state === 'All Nigeria' || b.state === state) && matchesQuery(b)
  );

  const verifiedBusinesses = scoped.filter((b) => b.verification_level !== 'registered');
  const newestFirst = [...scoped].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const visibleList =
    active === 'all' ? scoped : active === 'verified' ? verifiedBusinesses : active === 'new' ? newestFirst : [];

  const showEmptyMessage = active === 'trending' || active === 'top' || visibleList.length === 0;

  function emptyMessage(): string {
    if (active === 'trending') {
      return 'Not enough real activity data yet to show a Trending list. This will populate honestly once usage data exists.';
    }
    if (active === 'top') {
      return 'No reviews yet — Top Rated will populate once real customer reviews come in.';
    }
    if (scoped.length === 0 && businesses.length > 0 && query.trim()) {
      return `No businesses match "${query.trim()}" with the current filters.`;
    }
    if (scoped.length === 0 && businesses.length > 0) {
      return 'No businesses match that category and state combination yet.';
    }
    if (active === 'verified' && scoped.length > 0) {
      return 'No Verified or Advanced Verified businesses match these filters yet — check back as more complete verification.';
    }
    return 'No businesses have registered yet. Be the first to list one.';
  }

  const showListBusinessLink =
    (active === 'all' || active === 'verified') && businesses.length === 0;

  return (
    <>
      <div className="search-card" style={{ marginBottom: 28, maxWidth: 640 }}>
        <div className="search-icon-btn" aria-hidden="true">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx={11} cy={11} r={7} />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by business name, category, or location…"
          aria-label="Search marketplace"
        />
      </div>

      <div className="filter-bar">
        <select
          className="select-dropdown"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="All">Category: All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="select-dropdown"
          value={state}
          onChange={(e) => setState(e.target.value)}
          aria-label="Filter by state"
        >
          <option value="All Nigeria">State: All Nigeria</option>
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

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
          {showListBusinessLink && (
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
