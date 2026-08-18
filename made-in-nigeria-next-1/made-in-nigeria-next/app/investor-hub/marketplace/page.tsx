import { requireRole } from '@/lib/auth/requireRole';
import { createClient } from '@/lib/supabase/server';
import { InvestmentOpportunityCard } from '@/components/investor/OpportunityCard';
import { MarketplaceFilters } from '@/components/investor/MarketplaceFilters';

export default async function InvestorMarketplacePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { profile, supabase } = await requireRole(['investor']);

  // Build query with filters
  let query = supabase
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
        verification_level,
        description
      )
    `)
    .eq('status', 'open')
    .eq('visibility', 'public');

  // Apply filters from searchParams
  if (searchParams.sector) {
    // Filter by sector via business category
    // This would need to be handled differently based on your schema
  }

  if (searchParams.location) {
    // Filter by location
  }

  const { data: opportunities } = await query.order('ai_compatibility_score', { ascending: false });

  // Get investor preferences for personalized view
  const { data: investorProfile } = await supabase
    .from('investor_profiles')
    .select('*')
    .eq('user_id', profile.id)
    .single();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-forest-900">Investment Marketplace</h1>
        <p className="text-forest-600">Discover and evaluate businesses seeking investment</p>
      </div>

      {/* Filters */}
      <MarketplaceFilters />

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities && opportunities.length > 0 ? (
          opportunities.map((opp: any) => (
            <InvestmentOpportunityCard
              key={opp.id}
              opportunity={opp}
              business={opp.businesses}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-forest-500">
            <p className="text-lg">No investment opportunities available yet.</p>
            <p className="text-sm">Check back later or adjust your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
