'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export default function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Remove "${productName}" from your listings?`)) return;

    setLoading(true);
    await supabase.from('products').delete().eq('id', productId);
    router.refresh();
  }

  return (
    <button
      type="button"
      className="btn btn-outline btn-sm"
      onClick={handleDelete}
      disabled={loading}
      style={{ color: '#9A3B2E', borderColor: '#E8B4AA' }}
    >
      {loading ? 'Removing…' : 'Remove'}
    </button>
  );
}
