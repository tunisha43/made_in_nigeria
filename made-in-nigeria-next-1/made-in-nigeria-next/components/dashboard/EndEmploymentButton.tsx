'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface EndEmploymentButtonProps {
  memberId: string;
  memberName: string;
}

export default function EndEmploymentButton({ memberId, memberName }: EndEmploymentButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleEnd() {
    if (!window.confirm(`Mark ${memberName} as no longer working here? Their record stays in your team history.`)) {
      return;
    }

    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('team_members') as any).update({ end_date: today }).eq('id', memberId);

    router.refresh();
  }

  return (
    <button
      type="button"
      className="btn btn-outline btn-sm"
      onClick={handleEnd}
      disabled={loading}
      style={{ color: '#9A3B2E', borderColor: '#E8B4AA' }}
    >
      {loading ? 'Updating…' : 'End Employment'}
    </button>
  );
}
