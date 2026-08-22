import { createClient } from '@/lib/supabase/server';

export type InvestorInvestment = {
  id: string; business_id: string; business_name: string; category: string;
  invested_kobo: number; current_value_kobo: number; return_pct: number;
  status: 'active' | 'completed' | 'pending'; created_at: string;
};

export type InvestorOpportunity = {
  id: string; business_id: string; business_name: string; category: string;
  city: string | null; state: string | null; description: string | null;
  target_kobo: number; committed_kobo: number; min_kobo: number;
  projected_return_pct: number; verification_level: string;
};

export type InvestorSnapshot = {
  totalInvested: number; portfolioValue: number; activeSponsorships: number;
  escrowBalance: number; investments: InvestorInvestment[]; opportunities: InvestorOpportunity[];
};

const demoInvestments: InvestorInvestment[] = [
  { id:'demo-1', business_id:'demo-b1', business_name:'Adaeze Textiles', category:'Textiles & Fashion', invested_kobo:85000000, current_value_kobo:103700000, return_pct:22, status:'active', created_at:'2026-01-10' },
  { id:'demo-2', business_id:'demo-b2', business_name:'Bayelsa Fresh Farms', category:'Agriculture', invested_kobo:110000000, current_value_kobo:125400000, return_pct:14, status:'active', created_at:'2026-02-12' },
  { id:'demo-3', business_id:'demo-b3', business_name:'Okon Leather Works', category:'Manufacturing', invested_kobo:60000000, current_value_kobo:61800000, return_pct:3, status:'active', created_at:'2026-03-08' },
  { id:'demo-4', business_id:'demo-b4', business_name:'Ekene Woodcraft', category:'Furniture', invested_kobo:45000000, current_value_kobo:45000000, return_pct:0, status:'active', created_at:'2026-06-03' },
];

const demoOpportunities: InvestorOpportunity[] = [
  { id:'opp-1', business_id:'demo-b5', business_name:'Uduak Beads & Craft', category:'Handmade Goods', city:'Uyo', state:'Akwa Ibom', description:'Working capital to fulfil a wholesale export order.', target_kobo:50000000, committed_kobo:22500000, min_kobo:500000, projected_return_pct:18, verification_level:'verified' },
  { id:'opp-2', business_id:'demo-b6', business_name:"Josephine's Kitchen Co.", category:'Food & Catering', city:'Lagos', state:'Lagos', description:'Expanding into a second commercial kitchen location.', target_kobo:90000000, committed_kobo:63000000, min_kobo:1000000, projected_return_pct:16, verification_level:'verified' },
  { id:'opp-3', business_id:'demo-b7', business_name:'Nnamdi Solar Works', category:'Energy', city:'Enugu', state:'Enugu', description:'Solar equipment inventory for commercial installations.', target_kobo:120000000, committed_kobo:36000000, min_kobo:1500000, projected_return_pct:21, verification_level:'registered' },
];

export async function getInvestorSnapshot(userId: string): Promise<InvestorSnapshot> {
  const supabase = await createClient();
  const db = supabase as any;
  const [{ data: investments }, { data: opportunities }, { data: escrow }] = await Promise.all([
    db.from('investments').select('id,business_id,invested_kobo,current_value_kobo,return_pct,status,created_at,businesses(name,category)').eq('investor_id', userId).order('created_at', { ascending: false }),
    db.from('investment_opportunities').select('id,business_id,target_kobo,committed_kobo,min_kobo,projected_return_pct,description,businesses(name,category,city,state,verification_level)').eq('status', 'open').order('created_at', { ascending: false }),
    db.from('escrow_accounts').select('balance_kobo').eq('investor_id', userId).eq('status', 'held'),
  ]);

  const mappedInvestments = (investments ?? []).map((x: any) => ({
    id:x.id, business_id:x.business_id, business_name:x.businesses?.name ?? 'Business', category:x.businesses?.category ?? 'Business',
    invested_kobo:x.invested_kobo, current_value_kobo:x.current_value_kobo, return_pct:x.return_pct, status:x.status, created_at:x.created_at,
  })) as InvestorInvestment[];
  const mappedOpportunities = (opportunities ?? []).map((x: any) => ({
    id:x.id, business_id:x.business_id, business_name:x.businesses?.name ?? 'Business', category:x.businesses?.category ?? 'Business',
    city:x.businesses?.city ?? null, state:x.businesses?.state ?? null, description:x.description,
    target_kobo:x.target_kobo, committed_kobo:x.committed_kobo, min_kobo:x.min_kobo, projected_return_pct:x.projected_return_pct,
    verification_level:x.businesses?.verification_level ?? 'registered',
  })) as InvestorOpportunity[];

  const rows = mappedInvestments.length ? mappedInvestments : demoInvestments;
  const opps = mappedOpportunities.length ? mappedOpportunities : demoOpportunities;
  const totalInvested = rows.reduce((sum, x) => sum + x.invested_kobo, 0);
  const portfolioValue = rows.reduce((sum, x) => sum + x.current_value_kobo, 0);
  const escrowBalance = (escrow ?? []).reduce((sum: number, x: any) => sum + (x.balance_kobo ?? 0), 0) || 64000000;
  return { totalInvested, portfolioValue, activeSponsorships: rows.filter(x => x.status === 'active').length, escrowBalance, investments: rows, opportunities: opps };
}

export function naira(kobo: number) {
  return new Intl.NumberFormat('en-NG', { style:'currency', currency:'NGN', maximumFractionDigits:0 }).format(kobo / 100);
}
