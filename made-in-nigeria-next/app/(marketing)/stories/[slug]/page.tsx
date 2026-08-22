import { notFound } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Story = Database['public']['Tables']['stories']['Row'];
type Business = Database['public']['Tables']['businesses']['Row'];

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('stories').select('*').eq('slug', slug).eq('status', 'published').single();
  const story = data as Story | null;
  if (!story) notFound();
  const { data: businessData } = await supabase.from('businesses').select('*').eq('id', story.business_id).single();
  const business = businessData as Business | null;
  return <><div className="wrap breadcrumb"><Link href="/">Home</Link> / <Link href="/stories">Stories</Link> / {story.title}</div><section className="section"><div className="wrap" style={{maxWidth:900}}><Badge variant="verified">{story.story_type}</Badge><h1 style={{marginTop:12}}>{story.title}</h1>{business && <p style={{color:'var(--ink-soft)',marginTop:8}}>Story by <Link href={`/business/${business.slug}`}>{business.name}</Link>{business.city ? ` · ${business.city}, ${business.state ?? ''}` : ''}</p>}<div className="info-card" style={{marginTop:28}}><p style={{whiteSpace:'pre-wrap',fontSize:15,lineHeight:1.8}}>{story.content}</p></div>{business && <div className="banner" style={{marginTop:28}}><div className="banner-inner"><div className="eyebrow hero-eyebrow">Discover the business</div><h3>{business.name}</h3><p>{business.description || 'Explore this business, its products and its Made in Nigeria profile.'}</p><Link href={`/business/${business.slug}`} className="btn btn-gold">View Business Profile</Link></div></div>}</div></section></>;
}
