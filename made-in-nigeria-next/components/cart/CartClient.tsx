'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

function naira(kobo: number) { return `₦${(kobo / 100).toLocaleString('en-NG')}`; }

export default function CartClient() {
  const { items, subtotalKobo, updateQuantity, removeItem } = useCart();

  if (!items.length) return (
    <div className="empty-state" style={{ marginTop: 28 }}>
      <h2>Your cart is empty</h2>
      <p style={{ margin: '8px 0 18px' }}>Discover products from verified Nigerian businesses.</p>
      <Link href="/marketplace" className="btn btn-primary">Browse Marketplace</Link>
    </div>
  );

  return (
    <div className="cart-layout">
      <div className="cart-items">
        {items.map((item) => (
          <article className="cart-item" key={item.productId}>
            <div className="biz-thumb thumb-1" aria-hidden="true" />
            <div className="cart-item-main">
              <div className="eyebrow">{item.sellerName}</div>
              <h3>{item.name}</h3>
              <div className="cart-price">{naira(item.priceKobo)}</div>
              <div className="cart-item-actions">
                <div className="cart-qty">
                  <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Increase quantity">+</button>
                </div>
                <button type="button" className="text-button" onClick={() => removeItem(item.productId)}>Remove</button>
              </div>
            </div>
            <strong>{naira(item.priceKobo * item.quantity)}</strong>
          </article>
        ))}
      </div>

      <aside className="cart-summary card">
        <div className="eyebrow">Order summary</div>
        <div className="summary-row"><span>Subtotal</span><strong>{naira(subtotalKobo)}</strong></div>
        <div className="summary-row"><span>Delivery</span><span>Calculated at checkout</span></div>
        <div className="summary-total"><span>Total</span><strong>{naira(subtotalKobo)}</strong></div>
        <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 18 }}>Proceed to Checkout</Link>
        <Link href="/marketplace" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>Continue Shopping</Link>
      </aside>
    </div>
  );
}
