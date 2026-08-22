import { redirect } from 'next/navigation';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { getBusinessNav } from '@/components/dashboard/businessNav';
import { requireRole } from '@/lib/auth/requireRole';
import AddTeamMemberForm from '@/components/dashboard/AddTeamMemberForm';
import EndEmploymentButton from '@/components/dashboard/EndEmploymentButton';
import type { Database } from '@/types/database';

type Business = Database['public']['Tables']['businesses']['Row'];
type TeamMember = Database['public']['Tables']['team_members']['Row'];

export const metadata = {
  title: 'Team',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function TeamPage() {
  const { user, profile, supabase } = await requireRole(['business_owner']);

  const { data: businessData } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .single();
  const business = businessData as Business | null;
  if (!business) redirect('/register');
  const biz: Business = business as Business;

  const { data: teamData } = await supabase
    .from('team_members')
    .select('*')
    .eq('business_id', biz.id)
    .order('start_date', { ascending: false });
  const team = (teamData as TeamMember[] | null) ?? [];

  const current = team.filter((m) => !m.end_date);
  const previous = team.filter((m) => m.end_date);

  return (
    <DashboardShell
      navSections={getBusinessNav(biz.slug, 'team')}
      signedInAs={profile.full_name || 'Business Owner'}
      signedInSubtext={`${biz.name} · ${biz.min_id ?? 'ID pending'}`}
      welcomeTitle="Team"
      welcomeSubtitle={`${current.length} current, ${previous.length} previous team member${previous.length === 1 ? '' : 's'}.`}
    >
      <div className="widget span-4">
        <div className="widget-head"><h3>Add a Team Member</h3></div>
        <AddTeamMemberForm businessId={biz.id} />
      </div>

      <div className="widget span-4">
        <div className="widget-head"><h3>Current Team</h3></div>
        {current.length === 0 ? (
          <div className="empty-state">No current team members. Add one above.</div>
        ) : (
          current.map((member) => (
            <div className="team-row" key={member.id}>
              <div className="team-avatar" style={{ background: 'var(--forest-700)' }}>
                {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div className="name">{member.name} — {member.position}</div>
                <div className="act">
                  Since {formatDate(member.start_date)}
                  {member.phone && <> · {member.phone}</>}
                  {member.email && <> · {member.email}</>}
                </div>
              </div>
              <EndEmploymentButton memberId={member.id} memberName={member.name} />
            </div>
          ))
        )}
      </div>

      {previous.length > 0 && (
        <div className="widget span-4">
          <div className="widget-head"><h3>Previous Team</h3></div>
          {previous.map((member) => (
            <div className="team-row" key={member.id}>
              <div className="team-avatar" style={{ background: 'var(--ink-soft)' }}>
                {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div className="name">{member.name} — {member.position}</div>
                <div className="act">
                  {formatDate(member.start_date)} – {formatDate(member.end_date as string)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
