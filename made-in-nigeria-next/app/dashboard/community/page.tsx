import Link from 'next/link';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { getBusinessNav } from '@/components/dashboard/businessNav';
import { requireRole } from '@/lib/auth/requireRole';
import { CommunityPostForm } from '@/components/dashboard/BusinessContentForm';
import type { Database } from '@/types/database';

type Business = Database['public']['Tables']['businesses']['Row'];
type Post = Database['public']['Tables']['community_posts']['Row'];

export const metadata = { title: 'Community' };

export default async function BusinessCommunityPage() {
  const { user, profile, supabase } = await requireRole(['business_owner']);

  const { data: bizData } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle();

  // Explicitly type the query result so TypeScript doesn't infer it as `never`.
  const biz = bizData as Business | null;

  if (!biz) {
    return (
      <div className="wrap section">
        <h1>Create your business first</h1>
        <Link href="/register" className="btn btn-primary">
          Create business
        </Link>
      </div>
    );
  }

  const { data: postsData } = await supabase
    .from('community_posts')
    .select('*')
    .eq('business_id', biz.id)
    .order('created_at', { ascending: false });

  const posts = (postsData as Post[] | null) ?? [];

  return (
    <DashboardShell
      navSections={getBusinessNav(biz.slug, 'community')}
      signedInAs={profile.full_name || 'Business Owner'}
      signedInSubtext={biz.name}
      welcomeTitle="Community Hub"
      welcomeSubtitle="Ask questions, share lessons and build genuine relationships with other Nigerian businesses."
    >
      <div className="widget span-2">
        <div className="widget-head">
          <h3>Start a conversation</h3>
        </div>
        <CommunityPostForm businessId={biz.id} sector={biz.category} />
      </div>

      <div className="widget span-2">
        <div className="widget-head">
          <h3>Your community posts</h3>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">
            Your published posts will appear here.
          </div>
        ) : (
          posts.map((p) => (
            <div className="feed-post" key={p.id}>
              <div className="feed-name">{p.title || 'Community post'}</div>
              <div className="feed-meta">
                {p.sector} ·{' '}
                {new Date(p.created_at).toLocaleDateString('en-NG')}
              </div>
              <p className="feed-body">{p.body}</p>
              <div className="feed-engagement">
                <span>♥ {p.likes_count}</span>
                <span>💬 {p.comments_count}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="widget span-4">
        <Link href="/community-hub" className="section-link">
          Open public Community Hub →
        </Link>
      </div>
    </DashboardShell>
  );
}