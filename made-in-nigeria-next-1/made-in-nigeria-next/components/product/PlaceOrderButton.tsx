'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface PlaceOrderButtonProps {
  businessId: string;
  productId: string;
}

export default function PlaceOrderButton({ businessId, productId }: PlaceOrderButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlaceOrder() {
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth');
      return;
    }

    const payload = { business_id: businessId, product_id: productId, customer_id: user.id, status: 'pending' };

    // Cast at the call site rather than trusting supabase-js's generic
    // resolution here -- see the long comment in types/database.ts and
    // lib/auth/requireRole.ts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase.from('orders') as any).insert(payload);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setPlaced(true);
    setLoading(false);
  }

  if (placed) {
    return (
      <div style={{ padding: '13px 18px', borderRadius: 10, background: 'var(--forest-050)', color: 'var(--forest-800)', fontSize: 14, textAlign: 'center', flex: 1 }}>
        Order placed — the seller will follow up to arrange delivery.
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        style={{ flex: 1, justifyContent: 'center' }}
        onClick={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? 'Placing order…' : 'Place Order'}
      </button>
      {error && (
        <div style={{ marginTop: 12, fontSize: 13, color: '#9A3B2E', background: '#FBEAE7', padding: 10, borderRadius: 10, width: '100%' }}>
          {error}
        </div>
      )}
    </>
  );
}
