'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartBadge from '@/components/cart/CartBadge';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/stories', label: 'Stories' },
  { href: '/community-hub', label: 'Community' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="logo">
          <span className="script">Made in</span>
          <span className="bold">NIGERIA</span>
          <span className="leaf">●</span>
        </Link>

        <nav className={`nav-links${open ? ' open' : ''}`} id="navLinks">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/auth?role=business" onClick={() => setOpen(false)}>
            List a Business
          </Link>
        </nav>

        <div className="nav-cta">
          <CartBadge />
          <Link href="/auth" className="btn btn-outline btn-sm">
            Sign In
          </Link>
          <Link href="/auth" className="btn btn-primary btn-sm">
            Join Now
          </Link>
          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
