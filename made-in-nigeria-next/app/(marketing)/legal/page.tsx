import Link from 'next/link';

export const metadata = {
  title: 'Standards & Terms',
};

const TOC = [
  { href: '#standards', label: 'Community Standards' },
  { href: '#terms', label: 'Terms of Service' },
  { href: '#verification-policy', label: 'Verification Policy' },
  { href: '#data', label: 'Data Transparency' },
  { href: '#prohibited', label: 'Prohibited Content' },
];

export default function LegalPage() {
  return (
    <>
      <section className="page-header">
        <div className="wrap">
          <div className="eyebrow">Standards & Terms</div>
          <h1>Community Standards, Terms of Service &amp; Data Transparency</h1>
          <p>
            Everything that governs how Made in Nigeria works, in one place — plain language first,
            with the formal terms below.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap legal-shell">
          <nav className="legal-toc">
            {TOC.map((item) => (
              <a href={item.href} key={item.href}>{item.label}</a>
            ))}
          </nav>

          <div className="legal-body">
            <div className="legal-updated">Last updated: August 2026</div>

            <h2 id="standards">Community Standards</h2>
            <p>
              Made in Nigeria exists on a simple premise: no business builds alone, and no one gets
              ahead by faking it. Everyone on the platform — business owners, customers, investors,
              and Builders — is expected to act on that.
            </p>
            <ul>
              <li>Represent your business honestly — real photos, real pricing, real availability.</li>
              <li>Reviews and ratings must reflect a genuine experience. Paid or fabricated reviews are removed and repeat offenders are suspended.</li>
              <li>Treat other members with respect, especially across the Community Hub and Q&amp;A.</li>
              <li>Report concerns rather than escalate publicly — the Trust &amp; Verification team responds to every report.</li>
            </ul>

            <h2 id="terms">Terms of Service</h2>
            <p>
              By creating an account, you agree to use Made in Nigeria for its intended purpose:
              discovering, running, investing in, or supporting Nigerian businesses. You&apos;re
              responsible for the accuracy of what you post under your account, and for any
              transactions you enter into with other members.
            </p>
            <p>
              Made in Nigeria facilitates connections and, where applicable, escrow-protected
              payments — it is not a party to agreements between buyers, sellers, or investors and
              businesses. Accounts found violating Community Standards may be suspended or removed.
            </p>

            <h2 id="verification-policy">Verification Policy</h2>
            <p>
              Every verification badge is earned, never purchased or assumed. Registered, Verified,
              and Advanced Verified each require specific documentation and checks — detailed in full
              on the <Link href="/trust-verification" className="link-gold">Trust &amp; Verification Centre</Link>.
              Ranking and search placement follow the same rule: relevance, verification level,
              location fit, and real feedback — never payment.
            </p>

            <h2 id="data">Data Transparency</h2>
            <p>We collect only what&apos;s needed to run the platform and keep it trustworthy:</p>
            <ul>
              <li><b>Verification documents</b> — used only to confirm identity and location, never sold or shared with third parties.</li>
              <li><b>Order and review history</b> — powers your Health Score and search relevance; always computed from real activity, never self-reported.</li>
              <li><b>Contact details</b> — visible to logged-in users only, never scraped or exported in bulk.</li>
            </ul>
            <p>
              You can request a copy of your data or request deletion of your account at any time
              through Settings, or by contacting Support.
            </p>

            <h2 id="prohibited">Prohibited Content</h2>
            <p>
              The following are not permitted anywhere on Made in Nigeria: counterfeit or stolen
              goods, fabricated business credentials, misleading pricing, harassment or hate speech,
              and any content that endangers minors. Violations are removed on discovery and may
              result in immediate account suspension.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
