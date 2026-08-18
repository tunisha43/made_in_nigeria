import Link from 'next/link';
import { Database } from '@/types/database';

type Opportunity = Database['public']['Tables']['investment_opportunities']['Row'] & {
  businesses: Database['public']['Tables']['businesses']['Row'];
};

interface OpportunityCardProps {
  opportunity: Opportunity;
  business: Database['public']['Tables']['businesses']['Row'];
  showActions?: boolean;
}

export function InvestmentOpportunityCard({ opportunity, business, showActions = true }: OpportunityCardProps) {
  const matchScore = opportunity.ai_compatibility_score || 0;
  const matchLabel = matchScore >= 90 ? 'Excellent Match' 
    : matchScore >= 70 ? 'Strong Match' 
    : matchScore >= 50 ? 'Good Match' 
    : 'Consider Reviewing';

  return (
    <div className="bg-white border border-forest-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                ✓ Verified
              </span>
              {business.verification_level === 'advanced_verified' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gold-100 text-gold-800">
                  ★ Advanced Verified
                </span>
              )}
            </div>
            <Link href={`/investor/business/${business.id}`}>
              <h3 className="text-lg font-semibold text-forest-900 hover:text-gold-700 mt-1">
                {business.name}
              </h3>
            </Link>
            <p className="text-sm text-forest-600">
              📍 {business.city || business.state || 'Nigeria'} · {business.category}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-forest-900">
              ₦{(opportunity.amount_seeking / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-forest-500">{opportunity.investment_type}</div>
          </div>
        </div>

        {/* Business Stats */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <div>
            <span className="text-forest-500">Health Score</span>
            <div className="font-semibold text-forest-900">{business.health_score || 0}/100</div>
          </div>
          <div>
            <span className="text-forest-500">Stage</span>
            <div className="font-semibold text-forest-900 capitalize">{opportunity.status}</div>
          </div>
          <div>
            <span className="text-forest-500">Match</span>
            <div className="font-semibold text-gold-700">{matchScore}%</div>
          </div>
        </div>

        {/* AI Match Label */}
        <div className="mt-2 text-xs text-forest-600">
          🤝 {matchLabel}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-4 flex gap-2 flex-wrap">
            <Link
              href={`/investor/business/${business.id}`}
              className="bg-forest-700 hover:bg-forest-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 text-center"
            >
              View Opportunity
            </Link>
            <button className="border border-forest-200 hover:bg-forest-50 text-forest-700 px-3 py-2 rounded-lg text-sm transition-colors">
              💚 Save
            </button>
            <button className="border border-forest-200 hover:bg-forest-50 text-forest-700 px-3 py-2 rounded-lg text-sm transition-colors">
              💬 Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
