import { requireRole } from '@/lib/auth/requireRole';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { InvestmentOpportunityCard } from '@/components/investor/OpportunityCard';
import { StatsCard } from '@/components/investor/StatsCard';

export default async function InvestorDashboardPage() {
  const { profile, supabase } = await requireRole(['investor']);

  // Fetch investor profile
  const { data: investorProfile } = await supabase
    .from('investor_profiles')
    .select('*')
    .eq('user_id', profile.id)
    .single();

  // Fetch portfolio stats
  const { data: portfolioStats } = await supabase
    .from('agreements')
    .select('amount, status')
    .eq('investor_id', investorProfile?.id);

  const totalInvested = portfolioStats?.reduce((sum, a) => sum + a.amount, 0) || 0;
  const activeInvestments = portfolioStats?.filter(a => a.status === 'active').length || 0;

  // Fetch top matches (AI-ranked opportunities)
  const { data: topMatches } = await supabase
    .from('investment_opportunities')
    .select(`
      *,
      businesses (
        id,
        name,
        category,
        state,
        city,
        health_score,
        verification_level
      )
    `)
    .eq('status', 'open')
    .eq('visibility', 'public')
    .order('ai_compatibility_score', { ascending: false })
    .limit(4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-forest-900">Welcome back, {profile.full_name}</h1>
        <p className="text-forest-600 mt-1">
          Discover, evaluate, and fund Nigeria's next generation of businesses.
        </p>
      </div>

      {/* AI Summary Card */}
      <div className="bg-gold-50 border border-gold-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="text-2xl">🤖</div>
          <div>
            <p className="font-medium text-forest-900">AI Investment Summary</p>
            <p className="text-forest-700">
              {topMatches && topMatches.length > 0 
                ? `${topMatches.length} new investment opportunities match your profile this week.`
                : 'Complete your investment preferences to get personalized matches.'}
            </p>
            <p className="text-forest-600 text-sm mt-1">
              {activeInvestments > 0 
                ? `You have ${activeInvestments} active investments.`
                : 'Start building your portfolio today.'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Portfolio Value"
          value={`₦${(totalInvested / 1000000).toFixed(1)}M`}
          change="+8.4%"
          changeType="positive"
        />
        <StatsCard
          label="Active Investments"
          value={activeInvestments.toString()}
          suffix="investments"
        />
        <StatsCard
          label="Pending Reviews"
          value="3"
          suffix="opportunities"
        />
        <StatsCard
          label="AI Matches"
          value={topMatches?.length.toString() || "0"}
          suffix="businesses"
        />
      </div>

      {/* Top Matches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-forest-900">📈 Top Matches For You</h2>
          <Link href="/investor/marketplace" className="text-gold-600 hover:text-gold-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topMatches && topMatches.length > 0 ? (
            topMatches.map((opportunity: any) => (
              <InvestmentOpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                business={opportunity.businesses}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-forest-500">
              No matching opportunities yet. <br />
              <Link href="/investor/settings" className="text-gold-600 hover:underline">
                Update your preferences →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-forest-900 mb-4">📋 Recent Activity</h2>
        <div className="bg-white rounded-lg border border-forest-100 divide-y divide-forest-50">
          <div className="p-4 text-sm text-forest-700">Loading recent activity...</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link
          href="/investor/marketplace"
          className="bg-forest-50 hover:bg-forest-100 text-forest-800 p-4 rounded-lg text-center transition-colors"
        >
          ⚡ Browse Opportunities
        </Link>
        <Link
          href="/investor/portfolio"
          className="bg-forest-50 hover:bg-forest-100 text-forest-800 p-4 rounded-lg text-center transition-colors"
        >
          📊 View My Portfolio
        </Link>
        <Link
          href="/investor/due-diligence"
          className="bg-forest-50 hover:bg-forest-100 text-forest-800 p-4 rounded-lg text-center transition-colors"
        >
          🔍 Due Diligence
        </Link>
        <Link
          href="/investor/settings"
          className="bg-forest-50 hover:bg-forest-100 text-forest-800 p-4 rounded-lg text-center transition-colors"
        >
          ⚙️ Preferences
        </Link>
      </div>
    </div>
  );
}
