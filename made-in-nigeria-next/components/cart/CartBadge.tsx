'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export default function CartBadge() {
  const { itemCount } = useCart();
  return (
    <Link href="/cart" aria-label={`Cart with ${itemCount} item${itemCount === 1 ? '' : 's'}`} className="cart-link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
        <circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" />
      </svg>
      {itemCount > 0 && <span>{itemCount > 99 ? '99+' : itemCount}</span>}
    </Link>
  );
}
