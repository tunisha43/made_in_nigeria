import { requireRole } from '@/lib/auth/requireRole';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function PortfolioPage() {
  const { profile, supabase } = await requireRole(['investor']);

  const { data: investorProfile } = await supabase
    .from('investor_profiles')
    .select('id')
    .eq('user_id', profile.id)
    .single();

  // Fetch all agreements for this investor
  const { data: agreements } = await supabase
    .from('agreements')
    .select(`
      *,
      businesses (
        id,
        name,
        category,
        state,
        city
      ),
      investment_opportunities (
        investment_type,
        equity_offered
      )
    `)
    .eq('investor_id', investorProfile?.id)
    .order('created_at', { ascending: false });

  const totalInvested = agreements?.reduce((sum, a) => sum + a.amount, 0) || 0;
  const activeInvestments = agreements?.filter(a => a.status === 'active').length || 0;
  const completedInvestments = agreements?.filter(a => a.status === 'completed').length || 0;

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      under_review: 'bg-blue-100 text-blue-800',
      signed: 'bg-gold-100 text-gold-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      disputed: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-forest-900">My Portfolio</h1>
        <p className="text-forest-600">Track and manage your investments</p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-forest-100 rounded-lg p-5">
          <p className="text-sm text-forest-500">Total Value</p>
          <p className="text-2xl font-bold text-forest-900">₦{(totalInvested / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-white border border-forest-100 rounded-lg p-5">
          <p className="text-sm text-forest-500">Active</p>
          <p className="text-2xl font-bold text-forest-900">{activeInvestments}</p>
        </div>
        <div className="bg-white border border-forest-100 rounded-lg p-5">
          <p className="text-sm text-forest-500">Completed</p>
          <p className="text-2xl font-bold text-forest-900">{completedInvestments}</p>
        </div>
        <div className="bg-white border border-forest-100 rounded-lg p-5">
          <p className="text-sm text-forest-500">Total Investments</p>
          <p className="text-2xl font-bold text-forest-900">{agreements?.length || 0}</p>
        </div>
      </div>

      {/* Investment Cards */}
      <div>
        <h2 className="text-xl font-semibold text-forest-900 mb-4">Your Investments</h2>
        <div className="space-y-4">
          {agreements && agreements.length > 0 ? (
            agreements.map((agreement: any) => (
              <div
                key={agreement.id}
                className="bg-white border border-forest-100 rounded-lg p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <Link href={`/investor/business/${agreement.businesses.id}`}>
                      <h3 className="text-lg font-semibold text-forest-900 hover:text-gold-700">
                        {agreement.businesses.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-forest-600">
                      {agreement.businesses.category} · {agreement.businesses.city || agreement.businesses.state || 'Nigeria'}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-sm text-forest-600">
                      <span>💰 ₦{(agreement.amount / 1000000).toFixed(1)}M</span>
                      <span>·</span>
                      <span>{agreement.investment_opportunities?.investment_type || 'Investment'}</span>
                      {agreement.investment_opportunities?.equity_offered && (
                        <>
                          <span>·</span>
                          <span>{agreement.investment_opportunities.equity_offered}% Equity</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(agreement.status)}`}>
                      {agreement.status}
                    </span>
                    <Link
                      href={`/investor/agreements/${agreement.id}`}
                      className="text-forest-700 hover:text-gold-700 text-sm font-medium transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-forest-50 rounded-lg">
              <p className="text-forest-600">No investments yet.</p>
              <p className="text-sm text-forest-500 mt-1">
                Browse the <Link href="/investor/marketplace" className="text-gold-600 hover:underline">marketplace</Link> to find opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
