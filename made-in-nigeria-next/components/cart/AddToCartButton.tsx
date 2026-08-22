'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import type { CartItem } from '@/lib/cart/types';

export default function AddToCartButton({ item }: { item: CartItem }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(item);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  if (added) {
    return <Link href="/cart" className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }}>Added — View Cart</Link>;
  }

  return <button type="button" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleAdd}>Add to Cart</button>;
}
