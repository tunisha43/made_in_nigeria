import { DashboardNavSection } from '@/components/dashboard/DashboardShell';

const icon = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d={d}/></svg>;

export function investorNav(active: string): DashboardNavSection[] {
  return [{ label:'Investor Hub', items:[
    { href:'/investor-hub', label:'Overview', active:active==='overview', icon:icon('M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z') },
    { href:'/investor-hub/portfolio', label:'Portfolio businesses', active:active==='portfolio', icon:icon('M4 5h16v14H4zM8 9h8M8 13h5') },
    { href:'/investor-hub/capital', label:'Invested & value', active:active==='capital', icon:icon('M12 2v20M17 5H9.5a3.5 3.5 0 000 7H15a3.5 3.5 0 010 7H6') },
    { href:'/investor-hub/sponsorships', label:'Active sponsorships', active:active==='sponsorships', icon:icon('M20 7l-8 4-8-4 8-4 8 4zM4 12l8 4 8-4M4 17l8 4 8-4') },
    { href:'/investor-hub/escrow', label:'Escrow balance', active:active==='escrow', icon:icon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z') },
    { href:'/investor-hub/opportunities', label:'Opportunities', active:active==='opportunities', icon:icon('M12 2l2.7 6.3L21 9l-5 4.7L17.2 20 12 16.7 6.8 20 8 13.7 3 9l6.3-.7z') },
    { href:'/investor-hub/agreements', label:'Agreements & escrow', active:active==='agreements', icon:icon('M7 3h10v18H7zM9 7h6M9 11h6M9 15h4') },
    { href:'/investor-hub/wealth-planner', label:'Wealth planner', active:active==='wealth', icon:icon('M4 19V5M10 19V9M16 19V3M22 19H2') },
  ] }];
}
