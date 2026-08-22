'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface UnsaveBusinessButtonProps {
  savedRowId: string;
}

export default function UnsaveBusinessButton({ savedRowId }: UnsaveBusinessButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleUnsave() {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('saved_businesses') as any).delete().eq('id', savedRowId);
    router.refresh();
  }

  return (
    <button type="button" className="btn btn-outline btn-sm" onClick={handleUnsave} disabled={loading}>
      {loading ? 'Removing…' : 'Unsave'}
    </button>
  );
}
