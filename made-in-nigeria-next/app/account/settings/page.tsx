import DashboardShell from '@/components/dashboard/DashboardShell';
import { getCustomerNav } from '@/components/dashboard/customerNav';
import { requireRole } from '@/lib/auth/requireRole';
import SettingsForm from '@/components/account/SettingsForm';

export const metadata = {
  title: 'Settings',
};

export default async function SettingsPage() {
  const { user, profile } = await requireRole(['customer', 'professional']);

  return (
    <DashboardShell
      navSections={getCustomerNav('settings')}
      signedInAs={profile.full_name || 'there'}
      signedInSubtext={user.email ?? ''}
      welcomeTitle="Settings"
      welcomeSubtitle="Update your name, email, and password."
    >
      <SettingsForm
        userId={user.id}
        currentFullName={profile.full_name || ''}
        currentPhone={profile.phone || ''}
        currentEmail={user.email ?? ''}
      />
    </DashboardShell>
  );
}
