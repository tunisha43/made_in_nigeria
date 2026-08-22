import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Story = Database['public']['Tables']['stories']['Row'];
type Business = Database['public']['Tables']['businesses']['Row'];

export const metadata = { title: 'Featured Stories' };

const FALLBACK = [
  { title: 'From Aba workshop to a growing textile brand', type: 'Founder Story', business: 'Adaeze Textiles', excerpt: 'A founder journey about building trust, improving product presentation, and reaching new customers.' },
  { title: 'What it takes to build a food business beyond your city', type: 'Behind the Business', business: "Josephine's Kitchen Co.", excerpt: 'The systems, cold-chain questions, and community lessons behind a growing Nigerian food business.' },
  { title: 'Turning local craft into a wider market', type: 'Innovation Story', business: 'Okon Leather Works', excerpt: 'A look at how a Nigerian manufacturer is preparing its products for wholesale and export discovery.' },
];

export default async function StoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('stories').select('*').eq('status', 'published').order('featured', { ascending: false }).order('published_at', { ascending: false }).limit(24);
  const stories = (data as Story[] | null) ?? [];
  const businessIds = [...new Set(stories.map(s => s.business_id))];
  const { data: businessesData } = businessIds.length ? await supabase.from('businesses').select('*').in('id', businessIds) : { data: [] as Business[] };
  const businesses = (businessesData as Business[] | null) ?? [];
  const byId = new Map(businesses.map(b => [b.id, b]));

  return <>
    <section className="page-header"><div className="wrap"><div className="eyebrow">Made in Nigeria TV</div><h1>Featured Stories</h1><p>Founder journeys, behind-the-business moments, innovation and community impact — with every story connected to the business behind it.</p></div></section>
    <section className="section"><div className="wrap">
      {stories.length === 0 ? <div className="card-grid grid-3">{FALLBACK.map(s => <article className="biz-card" key={s.title}><div className="biz-thumb thumb-2" /><div className="biz-body"><Badge variant="verified">{s.type}</Badge><h3 style={{marginTop:10}}>{s.title}</h3><div className="biz-meta">{s.business}</div><p style={{fontSize:13,color:'var(--ink-soft)',lineHeight:1.6,marginTop:8}}>{s.excerpt}</p></div></article>)}</div> : <div className="card-grid grid-3">{stories.map(story => { const b = byId.get(story.business_id); return <article className="biz-card" key={story.id}><div className="biz-thumb thumb-2" /><div className="biz-body"><Badge variant={story.featured ? 'trending' : 'verified'}>{story.story_type}</Badge><h3 style={{marginTop:10}}>{story.title}</h3><div className="biz-meta">{b ? <Link href={`/business/${b.slug}`}>{b.name}</Link> : 'Made in Nigeria business'}</div><p style={{fontSize:13,color:'var(--ink-soft)',lineHeight:1.6,marginTop:8}}>{story.excerpt}</p><Link href={`/stories/${story.slug}`} className="section-link" style={{marginTop:12,display:'inline-flex'}}>Read story →</Link></div></article> })}</div>}
    </div></section>
  </>;
}
