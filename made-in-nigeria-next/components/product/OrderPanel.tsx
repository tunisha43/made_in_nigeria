'use client';

import { useState } from 'react';
import Link from 'next/link';
import QtyStepper from '@/components/product/QtyStepper';
import AddToCartButton from '@/components/cart/AddToCartButton';

interface OrderPanelProps {
  businessId: string;
  productId: string;
}

export default function OrderPanel({ businessId, productId, slug, name, priceKobo, sellerName }: OrderPanelProps & { slug: string; name: string; priceKobo: number; sellerName: string }) {
  const [qty, setQty] = useState(1);

  return (
    <>
      <div className="qty-row">
        <QtyStepper value={qty} onChange={setQty} />
        <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
          Seller will confirm delivery timing after ordering
        </span>
      </div>

      <div className="product-actions">
        <AddToCartButton item={{ businessId, productId, slug, name, priceKobo, quantity: qty, sellerName }} />
        <Link href="/auth" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
          Message Seller
        </Link>
      </div>
    </>
  );
}
