import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Stamp from '@/components/ui/Stamp';
import Tabs from '@/components/ui/Tabs';

export const metadata = {
  title: 'Community Hub',
};

const SECTORS = [
  { name: 'Fashion & Textiles', members: '340 members', icon: <path d="M6 2l1.5 5H3l4 4-1.5 6L12 14l6.5 3L17 11l4-4h-4.5L15 2H9L6 2z" /> },
  { name: 'Agriculture', members: '512 members', icon: <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" /> },
  { name: 'Manufacturing', members: '198 members', icon: <path d="M4 21v-6M12 21V9M20 21V3" /> },
  { name: 'Tech & Digital', members: '276 members', icon: <><rect x={3} y={4} width={18} height={14} rx={2} /><path d="M8 21h8M12 18v3" /></> },
  { name: 'Construction', members: '164 members', icon: <><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6" /></> },
];

const FEED_POSTS = [
  {
    name: 'Adaeze Nwosu · Adaeze Textiles',
    meta: 'Fashion & Textiles · 2h ago',
    thumb: 'thumb-2',
    body: 'Finally shipped our first export order to a buyer in London — three months after listing here. Thank you to everyone in this community who reviewed my product photos before I published them 🙏',
    likes: 34,
    comments: 12,
  },
  {
    name: "Josephine Adeyemi · Josephine's Kitchen Co.",
    meta: 'Food & Catering · 6h ago',
    thumb: 'thumb-4',
    body: 'Question for other food business owners — how are you handling cold storage for delivery beyond Lagos? Looking for recommendations before I expand.',
    likes: 19,
    comments: 27,
  },
];

const QA = [
  { q: 'How long does Advanced Verification actually take?', a: '14 answers' },
  { q: 'Best courier for interstate delivery from Aba?', a: '9 answers' },
  { q: 'Anyone exported to the UK through Made in Nigeria?', a: '6 answers' },
];

const MATCHING = [
  { name: 'Ekene Woodcraft', meta: 'Enugu', badge: 'new' as const, badgeLabel: 'Seeking Supplier', desc: 'Looking for a reliable hardwood supplier in the South-East.' },
  { name: 'Uduak Beads & Craft', meta: 'Uyo', badge: 'trending' as const, badgeLabel: 'Seeking Distributor', desc: 'Ready to scale beyond Akwa Ibom — open to distribution partners.' },
  { name: 'Okon Leather Works', meta: 'Port Harcourt', badge: 'verified' as const, badgeLabel: 'Seeking Co-founder', desc: 'Looking for an operations partner to manage growing wholesale demand.' },
];

export default function CommunityHubPage() {
  return (
    <>
      <section className="page-header">
        <div className="wrap">
          <div className="eyebrow">Community Hub</div>
          <h1>Grow together, not alone</h1>
          <p>
            Sector communities, real conversations, and partner matching &mdash; the &quot;we rise by
            lifting others&quot; part of the platform, made visible.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Sector Communities</div>
              <h2>Find your people</h2>
            </div>
          </div>
          <div className="card-grid grid-5">
            {SECTORS.map((s) => (
              <div className="sector-card" key={s.name}>
                <Stamp>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>{s.icon}</svg>
                </Stamp>
                <h4>{s.name}</h4>
                <p>{s.members}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Community Feed</div>
              <h2>What builders are talking about</h2>
            </div>
          </div>

          <Tabs
            tabs={[
              {
                key: 'feed',
                label: 'Feed',
                panel: (
                  <div style={{ maxWidth: 720 }}>
                    {FEED_POSTS.map((post) => (
                      <div className="feed-post" key={post.name}>
                        <div className="feed-head">
                          <div className={`feed-avatar ${post.thumb}`} aria-hidden="true" />
                          <div>
                            <div className="feed-name">{post.name}</div>
                            <div className="feed-meta">{post.meta}</div>
                          </div>
                        </div>
                        <p className="feed-body">{post.body}</p>
                        <div className="feed-engagement">
                          <span>&#9829; {post.likes}</span>
                          <span>&#128172; {post.comments} comments</span>
                          <span>&#8635; Share</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                key: 'qa',
                label: 'Q&A',
                panel: (
                  <div className="info-card" style={{ maxWidth: 720 }}>
                    {QA.map((item) => (
                      <div className="verify-row" key={item.q}>
                        <span style={{ fontWeight: 600 }}>{item.q}</span>
                        <span style={{ color: 'var(--ink-soft)', fontSize: 12.5 }}>{item.a}</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                key: 'matching',
                label: 'Partner Matching',
                panel: (
                  <div className="card-grid grid-3">
                    {MATCHING.map((m) => (
                      <div className="opp-card" key={m.name}>
                        <div className="opp-head">
                          <div><h4>{m.name}</h4><div className="opp-meta">{m.meta}</div></div>
                          <Badge variant={m.badge}>{m.badgeLabel}</Badge>
                        </div>
                        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{m.desc}</p>
                      </div>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="banner">
            <div className="banner-inner">
              <div className="eyebrow hero-eyebrow">Become a Builder</div>
              <h3>Help other businesses grow &mdash; and grow your own reputation.</h3>
              <p>
                Builders review, mentor, and share honest feedback across the community. It&apos;s one
                of the ways trust gets built here, person to person.
              </p>
              <Link href="/auth" className="btn btn-gold">Join the Community</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
