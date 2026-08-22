import type { ReactNode } from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { investorNav } from './InvestorNav';
import { naira, getInvestorSnapshot } from '@/lib/investor/data';

export default async function InvestorPage({ active, title, subtitle, children }: { active:string; title:string; subtitle:string; children:ReactNode }) {
  const { profile } = await (await import('@/lib/auth/requireRole')).requireRole(['investor']);
  return <DashboardShell navSections={investorNav(active)} signedInAs={profile.full_name || 'Investor'} signedInSubtext="Investor · Sponsor tier" welcomeTitle={title} welcomeSubtitle={subtitle}>{children}</DashboardShell>;
}

export { naira, getInvestorSnapshot };
