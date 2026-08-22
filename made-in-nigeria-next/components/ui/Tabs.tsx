'use client';

import { useState, ReactNode } from 'react';

export interface TabPanel {
  key: string;
  label: string;
  panel: ReactNode; // pre-rendered content for this tab, not a function
}

interface TabsProps {
  tabs: TabPanel[];
  defaultTab?: string;
  className?: string;
}

/**
 * Replaces the old data-tabs / data-panel + site.js click-listener pattern.
 *
 * IMPORTANT: `panel` must be pre-rendered ReactNode (JSX), not a function.
 * Server Components can pass JSX as props/children to Client Components like
 * this one, but they CANNOT pass functions (e.g. a `(active) => ReactNode`
 * render-prop) -- functions aren't serializable across the server/client
 * boundary and will fail the build with "Functions cannot be passed
 * directly to Client Components". Rendering all panels up front like this
 * costs a bit of unused DOM for inactive tabs, which is a fine trade-off
 * for content this size.
 *
 * Usage:
 *   <Tabs tabs={[
 *     { key: 'featured', label: 'Featured', panel: <FeaturedGrid /> },
 *     { key: 'verified', label: 'Verified', panel: <EmptyState /> },
 *   ]} />
 */
export default function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key);

  return (
    <div>
      <div className={className ?? 'tabs'}>
        {tabs.map((tab) => (
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
      {tabs.find((t) => t.key === active)?.panel}
    </div>
  );
}
