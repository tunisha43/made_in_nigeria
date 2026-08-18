import { requireRole } from '@/lib/auth/requireRole';
import { createClient } from '@/lib/supabase/server';
import { InvestorPreferencesForm } from '@/components/investor/PreferencesForm';

export default async function InvestorSettingsPage() {
  const { profile, supabase } = await requireRole(['investor']);

  const { data: investorProfile } = await supabase
    .from('investor_profiles')
    .select('*')
    .eq('user_id', profile.id)
    .single();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-forest-900">Investment Preferences</h1>
        <p className="text-forest-600">Tell us what you're looking for so we can match you with the right opportunities.</p>
      </div>

      <InvestorPreferencesForm initialData={investorProfile} />
    </div>
  );
}
