import { DashboardNavSection } from '@/components/dashboard/DashboardShell';

export type CustomerNavKey = 'overview' | 'orders' | 'saved-businesses' | 'reviews' | 'settings';

/**
 * Shared sidebar for every customer page under /account/*.
 * Wishlist was deliberately dropped entirely (not just left as a "#"
 * placeholder) -- it's not part of the plan anymore. Pages that don't
 * exist yet keep href="#" until they're built.
 */
export function getCustomerNav(active: CustomerNavKey): DashboardNavSection[] {
  return [
    {
      label: 'My Account',
      items: [
        {
          href: '/account',
          label: 'Overview',
          active: active === 'overview',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={3} y={3} width={7} height={9} rx={1.5} /><rect x={14} y={3} width={7} height={5} rx={1.5} /><rect x={14} y={12} width={7} height={9} rx={1.5} /><rect x={3} y={16} width={7} height={5} rx={1.5} /></svg>
          ),
        },
        {
          href: '/account/orders',
          label: 'Orders',
          active: active === 'orders',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2l1.5 5H3l4 4-1.5 6L12 14l6.5 3L17 11l4-4h-4.5L15 2H9L6 2z" /></svg>
          ),
        },
        {
          href: '/account/saved-businesses',
          label: 'Saved Businesses',
          active: active === 'saved-businesses',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" /></svg>
          ),
        },
        {
          href: '/account/reviews',
          label: 'My Reviews',
          active: active === 'reviews',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" /></svg>
          ),
        },
        {
          href: '/account/settings',
          label: 'Settings',
          active: active === 'settings',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={3} /><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></svg>
          ),
        },
      ],
    },
  ];
}
