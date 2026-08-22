import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Stamp from '@/components/ui/Stamp';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Post = Database['public']['Tables']['community_posts']['Row'];
type Business = Database['public']['Tables']['businesses']['Row'];

export const metadata = { title: 'Community Hub' };

const SECTOR_ICONS: Record<string, React.ReactNode> = {
  'Fashion & Textiles': <path d="M6 2l1.5 5H3l4 4-1.5 6L12 14l6.5 3L17 11l4-4h-4.5L15 2H9L6 2z" />,
  Agriculture: <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />,
  Manufacturing: <path d="M4 21v-6M12 21V9M20 21V3" />,
  'Tech & Digital': <><rect x={3} y={4} width={18} height={14} rx={2} /><path d="M8 21h8M12 18v3" /></>,
  Construction: <><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" /></>,
};

export default async function CommunityHubPage() {
  const supabase = await createClient();
  const { data: postsData } = await supabase.from('community_posts').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(30);
  const posts = (postsData as Post[] | null) ?? [];
  const ids = [...new Set(posts.map(p => p.business_id))];
  const { data: businessesData } = ids.length ? await supabase.from('businesses').select('*').in('id', ids) : { data: [] as Business[] };
  const businesses = (businessesData as Business[] | null) ?? [];
  const byId = new Map(businesses.map(b => [b.id, b]));
  const { data: allBusinesses } = await supabase.from('businesses').select('id,category');
  const counts = new Map<string, number>();
  ((allBusinesses as Pick<Business,'id'|'category'>[] | null) ?? []).forEach(b => counts.set(b.category, (counts.get(b.category) ?? 0) + 1));
  const sectors = [...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5);

  return <>
    <section className="page-header"><div className="wrap"><div className="eyebrow">Community Hub</div><h1>Grow together, not alone</h1><p>Sector communities, real conversations, and partner matching — a place for Nigerian businesses to learn, collaborate and grow.</p></div></section>
    <section className="section"><div className="wrap"><div className="section-head"><div><div className="eyebrow">Sector Communities</div><h2>Find your people</h2></div></div>{sectors.length ? <div className="card-grid grid-5">{sectors.map(([name,count])=><div className="sector-card" key={name}><Stamp><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>{SECTOR_ICONS[name] ?? <circle cx={12} cy={12} r={8}/>}</svg></Stamp><h4>{name}</h4><p>{count} business{count===1?'':'es'} represented</p></div>)}</div> : <div className="empty-state">Sector communities will populate as businesses join the platform.</div>}</div></section>
    <section className="section section-alt"><div className="wrap"><div className="section-head"><div><div className="eyebrow">Community Feed</div><h2>What builders are talking about</h2></div></div>{posts.length ? <div style={{maxWidth:760}}>{posts.map(post=>{const b=byId.get(post.business_id); return <article className="feed-post" key={post.id}><div className="feed-head"><div className="feed-avatar thumb-2"/><div><div className="feed-name">{b ? <Link href={`/business/${b.slug}`}>{b.name}</Link> : 'Made in Nigeria Business'}</div><div className="feed-meta">{post.sector} · {new Date(post.created_at).toLocaleDateString('en-NG')}</div></div></div>{post.title&&<h3 style={{marginTop:14}}>{post.title}</h3>}<p className="feed-body">{post.body}</p><div className="feed-engagement"><span>♥ {post.likes_count}</span><span>💬 {post.comments_count} comments</span></div></article>})}</div> : <div className="empty-state" style={{maxWidth:760}}>No community posts have been published yet. Once businesses start sharing questions, lessons and milestones, they will appear here.</div>}</div></section>
    <section className="section"><div className="wrap"><div className="banner"><div className="banner-inner"><div className="eyebrow hero-eyebrow">Join the community</div><h3>Share what you know. Find who you need.</h3><p>Business owners can publish community posts and featured stories directly from their Business Dashboard.</p><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><Link href="/auth?role=business" className="btn btn-gold">Join as a Business</Link><Link href="/stories" className="btn btn-outline-light">Read Featured Stories</Link></div></div></div></div></section>
  </>;
}
