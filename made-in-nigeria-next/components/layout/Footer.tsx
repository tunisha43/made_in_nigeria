import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <span className="script">Made in</span>
              <span className="bold">NIGERIA</span>
            </Link>
            <p className="footer-mission">
              Africa&apos;s Business Growth Ecosystem. We don&apos;t just list businesses — we help
              businesses grow.
            </p>
            <div className="footer-values">
              We Rise by Lifting Others
              <br />
              Collaboration Over Competition
              <br />
              No Business Left Behind
              <br />
              Trust Before Transactions
            </div>
          </div>

          <div className="foot-col">
            <h5>Platform</h5>
            <ul>
              <li><Link href="/marketplace">Marketplace</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/auth?role=business">List a Business</Link></li>
              <li><Link href="/our-story">Our Story</Link></li>
            </ul>
          </div>

          <div className="foot-col">
            <h5>Community</h5>
            <ul>
              <li><Link href="/community-hub">Community Hub</Link></li>
              <li><Link href="/community-hub">Become a Builder</Link></li>
              <li><Link href="#">Mentorship</Link></li>
              <li><Link href="#">Business Rescue</Link></li>
              <li><Link href="/events">Events</Link></li>
            </ul>
          </div>

          <div className="foot-col">
            <h5>Company</h5>
            <ul>
              <li><Link href="#">About</Link></li>
              <li><Link href="/trust-verification">Trust &amp; Verification</Link></li>
              <li><Link href="/legal#terms">Terms &amp; Standards</Link></li>
              <li><Link href="#">Contact Support</Link></li>
            </ul>
          </div>

          <div className="foot-col">
            <h5>Stay updated</h5>
            <p style={{ fontSize: 13, color: '#9A927C', marginBottom: 4 }}>
              Real stories from real Nigerian businesses.
            </p>
            <div className="newsletter-row">
              <input type="email" placeholder="you@email.com" aria-label="Email for newsletter" />
              <button className="btn btn-gold btn-sm">Join</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Made in Nigeria. Building Nigeria&apos;s smartest AI-powered business ecosystem.</span>
          <span>
            <Link href="/legal#data">Privacy</Link>
            <Link href="/legal#terms">Terms</Link>
            <Link href="/legal#data">Data Transparency</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
