'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface MarkDeliveredButtonProps {
  orderId: string;
}

export default function MarkDeliveredButton({ orderId }: MarkDeliveredButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleMarkDelivered() {
    setLoading(true);

    // Cast at the call site rather than trusting supabase-js's generic
    // resolution here -- see the long comment in types/database.ts and
    // lib/auth/requireRole.ts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.from('orders').update({ status: 'delivered' } as any).eq('id', orderId);

    router.refresh();
  }

  return (
    <button type="button" className="btn btn-primary btn-sm" onClick={handleMarkDelivered} disabled={loading}>
      {loading ? 'Updating…' : 'Mark Delivered'}
    </button>
  );
}
