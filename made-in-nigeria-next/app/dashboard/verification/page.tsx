import Link from 'next/link';
import { requireRole } from '@/lib/auth/requireRole';
import { getBusinessNav } from '@/components/dashboard/businessNav';
import DashboardShell from '@/components/dashboard/DashboardShell';
import VerificationForm from '@/components/dashboard/VerificationForm';

export const metadata = { title: 'Business Verification' };

export default async function VerificationPage() {
  const { user, profile, supabase } = await requireRole(['business_owner']);

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!business) {
    return (
      <DashboardShell
        navSections={getBusinessNav('', 'verification')}
        signedInAs={profile.full_name || 'Business owner'}
        signedInSubtext="Business owner"
        welcomeTitle="Business verification"
        welcomeSubtitle="Complete your verification to build trust with customers."
      >
        <div className="widget span-4">
          <div className="widget-head"><h3>Set up your business first</h3></div>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>Create your business profile before submitting verification documents.</p>
          <Link href="/register" className="btn btn-primary" style={{ marginTop: 16 }}>Create business profile</Link>
        </div>
      </DashboardShell>
    );
  }

  const { data: submission } = await supabase
    .from('business_verification_submissions')
    .select('*')
    .eq('business_id', business.id)
    .maybeSingle();

  const { data: documents } = await supabase
    .from('business_verification_documents')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  return (
    <DashboardShell
      navSections={getBusinessNav(business.slug, 'verification')}
      signedInAs={profile.full_name || 'Business owner'}
      signedInSubtext={business.name}
      welcomeTitle="Business verification"
      welcomeSubtitle="Submit the details and documents that help us verify your business."
    >
      <VerificationForm business={business} submission={submission} documents={documents ?? []} />
    </DashboardShell>
  );
}
