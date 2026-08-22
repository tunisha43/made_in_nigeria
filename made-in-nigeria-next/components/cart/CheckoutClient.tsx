'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useCart } from './CartProvider';

function naira(kobo: number) { return `₦${(kobo / 100).toLocaleString('en-NG')}`; }

export default function CheckoutClient() {
  const router = useRouter();
  const { items, subtotalKobo, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', state: '', notes: '', paymentMethod: 'pay_on_delivery' });

  if (!items.length && !success) return (
    <div className="empty-state"><h2>Your cart is empty</h2><p style={{ margin: '8px 0 18px' }}>Add products before checking out.</p><Link href="/marketplace" className="btn btn-primary">Browse Marketplace</Link></div>
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null); setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth?redirect=/checkout'); return; }

    const payloads = items.map((item) => ({
      business_id: item.businessId,
      product_id: item.productId,
      customer_id: user.id,
      status: 'pending',
      quantity: item.quantity,
      unit_price_kobo: item.priceKobo,
      total_kobo: item.priceKobo * item.quantity,
      shipping_name: form.name,
      shipping_phone: form.phone,
      shipping_address: form.address,
      shipping_city: form.city,
      shipping_state: form.state,
      payment_method: form.paymentMethod,
      payment_status: 'unpaid',
      notes: form.notes || null,
    }));

    const { data, error: insertError } = await (supabase.from('orders') as any).insert(payloads).select('id');
    if (insertError) { setError(insertError.message); setLoading(false); return; }
    const orderIds = (data ?? []).map((row: { id: string }) => row.id).join(',');
    clear(); setSuccess(orderIds); setLoading(false);
  }

  if (success) return (
    <div className="checkout-success card">
      <div className="success-mark">✓</div>
      <div className="eyebrow">Order confirmed</div>
      <h2>Thank you for shopping Nigerian.</h2>
      <p>Your order has been submitted successfully. The seller will confirm availability and delivery details.</p>
      <div className="success-actions"><Link href="/account/orders" className="btn btn-primary">View My Orders</Link><Link href="/marketplace" className="btn btn-outline">Keep Shopping</Link></div>
    </div>
  );

  return (
    <form className="checkout-layout" onSubmit={submit}>
      <div className="checkout-form">
        <section className="card form-card"><div className="eyebrow">Delivery details</div><h2>Where should we deliver?</h2>
          <div className="form-grid">
            <label>Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label>Phone number<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
            <label className="full">Delivery address<input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
            <label>City<input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label>
            <label>State<input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></label>
          </div>
        </section>
        <section className="card form-card"><div className="eyebrow">Payment</div><h2>Choose how to pay</h2>
          <label className="radio-row"><input type="radio" name="payment" value="pay_on_delivery" checked={form.paymentMethod === 'pay_on_delivery'} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} /><span><strong>Pay on delivery</strong><small>Pay when your order arrives, where available.</small></span></label>
          <label className="radio-row"><input type="radio" name="payment" value="bank_transfer" checked={form.paymentMethod === 'bank_transfer'} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} /><span><strong>Bank transfer</strong><small>You'll receive transfer instructions after placing the order.</small></span></label>
          <label className="full">Order notes<textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Delivery instructions or other notes" /></label>
        </section>
      </div>
      <aside className="cart-summary card"><div className="eyebrow">Review order</div>{items.map(item => <div className="summary-row" key={item.productId}><span>{item.name} × {item.quantity}</span><strong>{naira(item.priceKobo * item.quantity)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>{naira(subtotalKobo)}</strong></div>{error && <div className="form-error">{error}</div>}<button className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 18 }}>{loading ? 'Placing order…' : 'Place Order'}</button></aside>
    </form>
  );
}
