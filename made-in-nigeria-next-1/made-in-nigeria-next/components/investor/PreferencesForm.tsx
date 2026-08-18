'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const INVESTOR_TYPES = [
  { value: 'first_time', label: 'First-Time Investor' },
  { value: 'experienced', label: 'Experienced Investor' },
  { value: 'angel', label: 'Angel Investor' },
  { value: 'impact', label: 'Impact Investor' },
  { value: 'diaspora', label: 'Diaspora Investor' },
  { value: 'corporate', label: 'Corporate Investor' },
  { value: 'government', label: 'Government / Development' },
  { value: 'vc', label: 'Venture Capital' },
  { value: 'strategic', label: 'Strategic Investor' },
];

const SECTORS = [
  'Agriculture & Food', 'Technology & Software', 'Manufacturing',
  'Fashion & Textiles', 'Construction & Real Estate', 'Healthcare',
  'Education', 'Energy & Utilities', 'Logistics & Transport',
  'Hospitality & Tourism', 'Professional Services', 'Creative Arts'
];

const STAGES = ['Startup', 'Early Growth', 'Expansion', 'Established', 'Turnaround/Rescue'];

const INVOLVEMENT_LEVELS = [
  { value: 'hands_off', label: 'Hands-Off' },
  { value: 'advisory', label: 'Advisory' },
  { value: 'active', label: 'Active' },
  { value: 'strategic', label: 'Strategic' },
];

interface PreferencesFormProps {
  initialData: any;
}

export function InvestorPreferencesForm({ initialData }: PreferencesFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    investorType: initialData?.investor_type || '',
    preferredSectors: initialData?.preferred_sectors || [],
    preferredStages: initialData?.preferred_stages || [],
    investmentSizeMin: initialData?.investment_size_min || '',
    investmentSizeMax: initialData?.investment_size_max || '',
    involvementLevel: initialData?.involvement_level || 'advisory',
    riskTolerance: initialData?.risk_tolerance || 5,
    geographicPreference: initialData?.geographic_preference || [],
    womenLedPreferred: initialData?.women_led_preferred || false,
    youthLedPreferred: initialData?.youth_led_preferred || false,
    sustainabilityPreferred: initialData?.sustainability_preferred || false,
    communityImpactPreferred: initialData?.community_impact_preferred || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const { error } = await supabase
      .from('investor_profiles')
      .upsert({
        user_id: initialData?.user_id,
        ...formData,
        updated_at: new Date().toISOString(),
      });

    setIsSaving(false);

    if (!error) {
      router.push('/investor');
    } else {
      alert('Error saving preferences. Please try again.');
    }
  };

  const toggleSector = (sector: string) => {
    setFormData(prev => ({
      ...prev,
      preferredSectors: prev.preferredSectors.includes(sector)
        ? prev.preferredSectors.filter(s => s !== sector)
        : [...prev.preferredSectors, sector]
    }));
  };

  const toggleStage = (stage: string) => {
    setFormData(prev => ({
      ...prev,
      preferredStages: prev.preferredStages.includes(stage)
        ? prev.preferredStages.filter(s => s !== stage)
        : [...prev.preferredStages, stage]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Investor Type */}
      <div>
        <label className="block text-sm font-medium text-forest-700 mb-2">
          Investor Type
        </label>
        <select
          value={formData.investorType}
          onChange={(e) => setFormData({ ...formData, investorType: e.target.value })}
          className="w-full rounded-lg border border-forest-200 px-4 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          required
        >
          <option value="">Select your type...</option>
          {INVESTOR_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Preferred Sectors */}
      <div>
        <label className="block text-sm font-medium text-forest-700 mb-2">
          Preferred Sectors
        </label>
        <div className="flex flex-wrap gap-2">
          {SECTORS.map(sector => (
            <button
              key={sector}
              type="button"
              onClick={() => toggleSector(sector)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                formData.preferredSectors.includes(sector)
                  ? 'bg-gold-600 text-white'
                  : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* Investment Size Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-forest-700 mb-2">
            Minimum Investment (₦)
          </label>
          <input
            type="number"
            value={formData.investmentSizeMin}
            onChange={(e) => setFormData({ ...formData, investmentSizeMin: Number(e.target.value) })}
            className="w-full rounded-lg border border-forest-200 px-4 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            placeholder="e.g. 1000000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-forest-700 mb-2">
            Maximum Investment (₦)
          </label>
          <input
            type="number"
            value={formData.investmentSizeMax}
            onChange={(e) => setFormData({ ...formData, investmentSizeMax: Number(e.target.value) })}
            className="w-full rounded-lg border border-forest-200 px-4 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            placeholder="e.g. 50000000"
          />
        </div>
      </div>

      {/* Involvement Level */}
      <div>
        <label className="block text-sm font-medium text-forest-700 mb-2">
          Preferred Involvement Level
        </label>
        <div className="flex flex-wrap gap-2">
          {INVOLVEMENT_LEVELS.map(level => (
            <button
              key={level.value}
              type="button"
              onClick={() => setFormData({ ...formData, involvementLevel: level.value })}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                formData.involvementLevel === level.value
                  ? 'bg-forest-700 text-white'
                  : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Tolerance */}
      <div>
        <label className="block text-sm font-medium text-forest-700 mb-2">
          Risk Tolerance: {formData.riskTolerance}/10
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.riskTolerance}
          onChange={(e) => setFormData({ ...formData, riskTolerance: Number(e.target.value) })}
          className="w-full accent-gold-600"
        />
        <div className="flex justify-between text-xs text-forest-500">
          <span>Conservative</span>
          <span>Balanced</span>
          <span>Aggressive</span>
        </div>
      </div>

      {/* Impact Preferences */}
      <div>
        <label className="block text-sm font-medium text-forest-700 mb-2">
          Impact Preferences
        </label>
        <div className="space-y-2">
          {[
            { key: 'womenLedPreferred', label: 'Women-Led Businesses' },
            { key: 'youthLedPreferred', label: 'Youth-Led Businesses' },
            { key: 'sustainabilityPreferred', label: 'Sustainability Focus' },
            { key: 'communityImpactPreferred', label: 'Community Impact' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-forest-700">
              <input
                type="checkbox"
                checked={formData[key as keyof typeof formData] as boolean}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                className="rounded text-gold-600 focus:ring-gold-500"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-gold-600 hover:bg-gold-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/investor')}
          className="border border-forest-200 hover:bg-forest-50 text-forest-700 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
