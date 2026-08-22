'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface SaveBusinessButtonProps {
  businessId: string;
  initiallySaved: boolean;
}

export default function SaveBusinessButton({ businessId, initiallySaved }: SaveBusinessButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [saved, setSaved] = useState(initiallySaved);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth');
      return;
    }

    if (saved) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('saved_businesses') as any)
        .delete()
        .eq('customer_id', user.id)
        .eq('business_id', businessId);
      setSaved(false);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('saved_businesses') as any).insert({ customer_id: user.id, business_id: businessId });
      setSaved(true);
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <button type="button" className="btn btn-outline btn-sm" onClick={handleToggle} disabled={loading}>
      {loading ? '…' : saved ? 'Saved ✓' : 'Follow'}
    </button>
  );
}
