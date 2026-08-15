'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export interface OrderDisplay {
  id: string;
  status: string;
  productName: string;
  businessName: string;
  businessId: string;
  productId: string | null;
}

interface ReviewFormInlineProps {
  order: OrderDisplay;
  onDone: () => void;
}

function ReviewFormInline({ order, onDone }: ReviewFormInlineProps) {
  const supabase = createClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Please sign in again.');
      setLoading(false);
      return;
    }

    const payload = {
      order_id: order.id,
      business_id: order.businessId,
      product_id: order.productId,
      customer_id: user.id,
      rating,
      comment: comment.trim() || null,
    };

    // Cast at the call site rather than trusting supabase-js's generic
    // resolution here -- see the long comment in types/database.ts and
    // lib/auth/requireRole.ts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase.from('reviews') as any).insert(payload);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '14px 0', borderTop: '1px solid var(--line)' }}>
      <div className="field">
        <label>Rating</label>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} star${n === 1 ? '' : 's'}`}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 22,
                lineHeight: 1,
                padding: 2,
                color: n <= rating ? 'var(--gold-500)' : 'var(--line)',
              }}
            >
              &#9733;
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <label htmlFor={`comment-${order.id}`}>
          Comment <span className="hint">(optional)</span>
        </label>
        <textarea
          id={`comment-${order.id}`}
          rows={2}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was your experience?"
        />
      </div>
      <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
        {loading ? 'Submitting…' : 'Submit Review'}
      </button>
      {error && (
        <div style={{ marginTop: 10, fontSize: 13, color: '#9A3B2E', background: '#FBEAE7', padding: 10, borderRadius: 10 }}>
          {error}
        </div>
      )}
    </form>
  );
}

interface OrdersWithReviewsProps {
  orders: OrderDisplay[];
  reviewedOrderIds: string[];
}

export default function OrdersWithReviews({ orders, reviewedOrderIds }: OrdersWithReviewsProps) {
  const router = useRouter();
  const reviewedSet = new Set(reviewedOrderIds);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        No orders yet. Browse the <Link href="/marketplace" className="link-gold">Marketplace</Link> to place your first one.
      </div>
    );
  }

  return (
    <>
      {orders.map((order) => {
        const alreadyReviewed = reviewedSet.has(order.id);
        const canReview = order.status === 'delivered' && !alreadyReviewed;

        return (
          <div key={order.id}>
            <div className="order-row">
              <span className="dot-tag">
                <span
                  className="dot-sm"
                  style={{ background: order.status === 'delivered' ? 'var(--forest-600)' : 'var(--gold-500)' }}
                />
                {order.productName} &middot; {order.businessName}
              </span>
              {canReview && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setOpenOrderId(openOrderId === order.id ? null : order.id)}
                >
                  {openOrderId === order.id ? 'Cancel' : 'Write a Review'}
                </button>
              )}
              {alreadyReviewed && (
                <span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>Reviewed</span>
              )}
              {!canReview && !alreadyReviewed && (
                <b style={{ textTransform: 'capitalize' }}>{order.status}</b>
              )}
            </div>
            {openOrderId === order.id && (
              <ReviewFormInline
                order={order}
                onDone={() => {
                  setOpenOrderId(null);
                  router.refresh();
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
