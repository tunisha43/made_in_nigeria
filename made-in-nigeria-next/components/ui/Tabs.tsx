'use client';

import { useState, ReactNode } from 'react';

export interface TabDef {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: TabDef[];
  defaultTab?: string;
  children: (activeTab: string) => ReactNode;
  className?: string;
}

/**
 * Replaces the old data-tabs / data-panel + site.js click-listener pattern.
 * Usage:
 *   <Tabs tabs={[{key:'featured', label:'Featured'}, ...]}>
 *     {(active) => active === 'featured' ? <FeaturedGrid /> : <OtherGrid />}
 *   </Tabs>
 */
export default function Tabs({ tabs, defaultTab, children, className }: TabsProps) {
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
      {children(active)}
    </div>
  );
}
