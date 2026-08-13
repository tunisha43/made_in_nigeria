import { DashboardNavSection } from '@/components/dashboard/DashboardShell';

export type BusinessNavKey =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'messages'
  | 'analytics'
  | 'verification'
  | 'team'
  | 'ai-coach'
  | 'events';

/**
 * Shared sidebar for every business-owner page under /dashboard/*.
 * Pass which item should show as active -- pages that don't exist yet
 * keep href="#" until they're built (Messages, AI Coach).
 */
export function getBusinessNav(businessSlug: string, active: BusinessNavKey): DashboardNavSection[] {
  return [
    {
      label: 'Headquarters',
      items: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          active: active === 'dashboard',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={3} y={3} width={7} height={9} rx={1.5} /><rect x={14} y={3} width={7} height={5} rx={1.5} /><rect x={14} y={12} width={7} height={9} rx={1.5} /><rect x={3} y={16} width={7} height={5} rx={1.5} /></svg>
          ),
        },
        {
          href: `/business/${businessSlug}`,
          label: 'Public Profile',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" /></svg>
          ),
        },
      ],
    },
    {
      label: 'Business',
      items: [
        {
          href: '/dashboard/products',
          label: 'Products',
          active: active === 'products',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          ),
        },
        {
          href: '/dashboard/orders',
          label: 'Orders',
          active: active === 'orders',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 2l1.5 5H3l4 4-1.5 6L12 14l6.5 3L17 11l4-4h-4.5L15 2H9L6 2z" /></svg>
          ),
        },
        {
          href: '#',
          label: 'Messages',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
          ),
        },
        {
          href: '/dashboard/analytics',
          label: 'Analytics',
          active: active === 'analytics',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
          ),
        },
        {
          href: '/trust-verification',
          label: 'Verification',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          ),
        },
      ],
    },
    {
      label: 'Grow',
      items: [
        {
          href: '/dashboard/team',
          label: 'Team',
          active: active === 'team',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={8} r={4} /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>
          ),
        },
        {
          href: '#',
          label: 'AI Coach',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" /></svg>
          ),
        },
        {
          href: '/events',
          label: 'Events',
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x={3} y={4} width={18} height={17} rx={2} /><path d="M3 9h18M8 2v4M16 2v4" /></svg>
          ),
        },
      ],
    },
  ];
}
