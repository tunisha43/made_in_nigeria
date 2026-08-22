import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import InvestorPage from '@/components/investor/InvestorPage';
import { getInvestorSnapshot, naira } from '@/lib/investor/data';
import { requireRole } from '@/lib/auth/requireRole';

export const metadata = { title:'Investor Hub' };

export default async function InvestorHubPage() {
  const { user } = await requireRole(['investor']);
  const s = await getInvestorSnapshot(user.id);
  const gain = s.portfolioValue - s.totalInvested;
  const gainPct = s.totalInvested ? (gain / s.totalInvested) * 100 : 0;
  return <InvestorPage active="overview" title={`Welcome back.`} subtitle="Here's how your portfolio is performing.">
    <div className="widget span-1 stat-widget"><div className="widget-head"><h3>Total Invested</h3></div><div className="figure">{naira(s.totalInvested)}</div><div className="delta delta-flat">Across {s.investments.length} businesses</div></div>
    <div className="widget span-1 stat-widget"><div className="widget-head"><h3>Portfolio Value</h3></div><div className="figure">{naira(s.portfolioValue)}</div><div className="delta delta-up">+{gainPct.toFixed(1)}% overall</div></div>
    <div className="widget span-1 stat-widget"><div className="widget-head"><h3>Active Sponsorships</h3></div><div className="figure">{s.activeSponsorships}</div><div className="delta delta-flat">Ongoing investments</div></div>
    <div className="widget span-1 stat-widget"><div className="widget-head"><h3>Escrow Balance</h3></div><div className="figure">{naira(s.escrowBalance)}</div><div className="delta delta-flat">Held pending milestones</div></div>

    <div className="widget span-4"><div className="widget-head"><h3>Portfolio overview</h3><Link className="w-link" href="/investor-hub/portfolio">View full portfolio →</Link></div>
      {s.investments.slice(0,4).map(p=><div className="order-row" key={p.id}><span className="dot-tag"><span className="dot-sm" style={{background:'var(--forest-700)'}} />{p.business_name} — {p.category}</span><b style={{color:p.return_pct >= 0 ? 'var(--forest-700)':'var(--clay)'}}>{p.return_pct >= 0 ? '+' : ''}{p.return_pct}% · {naira(p.current_value_kobo)}</b></div>)}
    </div>

    <div className="widget span-4"><div className="widget-head"><h3>Investment opportunities</h3><Link className="w-link" href="/investor-hub/opportunities">Browse all →</Link></div><div className="card-grid grid-3">
      {s.opportunities.slice(0,3).map(o=><div className="opp-card" key={o.id}><div className="opp-head"><div><h4>{o.business_name}</h4><div className="opp-meta">{o.category} · {o.city}</div></div><Badge variant={o.verification_level==='verified'?'verified':'new'}>{o.verification_level==='verified'?'Verified':'Registered'}</Badge></div><p style={{fontSize:12.5,color:'var(--ink-soft)'}}>{o.description}</p><div className="progress-track"><div className="progress-fill" style={{width:`${Math.min(100,Math.round(o.committed_kobo/o.target_kobo*100))}%`}} /></div><div className="opp-ask">Seeking {naira(o.target_kobo)} · {Math.round(o.committed_kobo/o.target_kobo*100)}% committed</div><Link className="btn btn-primary btn-sm" style={{marginTop:12}} href={`/investor-hub/opportunities/${o.id}`}>View opportunity</Link></div>)}
    </div></div>

    <div className="widget span-2"><div className="widget-head"><h3>Agreements & escrow</h3><Link className="w-link" href="/investor-hub/agreements">Manage →</Link></div><div className="order-row"><span>Milestone releases</span><b style={{color:'var(--forest-700)'}}>3 active</b></div><div className="order-row"><span>Documents requiring review</span><b style={{color:'var(--gold-600)'}}>2</b></div><div className="order-row"><span>Awaiting signature</span><b>1</b></div></div>
    <div className="widget span-2"><div className="widget-head"><h3>Wealth planner</h3><Link className="w-link" href="/investor-hub/wealth-planner">Open planner →</Link></div><p style={{fontSize:13,color:'var(--ink-soft)'}}>Annual sponsorship target</p><div className="progress-track"><div className="progress-fill" style={{width:`${Math.min(100,Math.round(s.totalInvested/720000000*100))}%`}} /></div><div className="progress-meta"><span>{naira(s.totalInvested)} deployed</span><span>Goal: ₦7.2M</span></div></div>
  </InvestorPage>;
}
