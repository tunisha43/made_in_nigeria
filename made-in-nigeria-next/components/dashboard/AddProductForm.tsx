'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}-${suffix}`;
}

interface AddProductFormProps {
  businessId: string;
}

export default function AddProductForm({ businessId }: AddProductFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const priceNaira = parseFloat(String(form.get('price') ?? '0'));
    const description = String(form.get('description') ?? '').trim();

    if (!name || isNaN(priceNaira) || priceNaira <= 0) {
      setError('Please enter a product name and a valid price.');
      setLoading(false);
      return;
    }

    const payload = {
      business_id: businessId,
      name,
      price_kobo: Math.round(priceNaira * 100),
      description: description || null,
      slug: slugify(name),
    };

    // Cast at the call site rather than trusting supabase-js's generic
    // resolution here -- see the long comment in types/database.ts and
    // lib/auth/requireRole.ts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase.from('products') as any).insert(payload);

    if (insertError) {
      setError(
        insertError.code === '23505'
          ? 'That produced a duplicate product ID — please try again.'
          : insertError.message
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="p-name">Product name</label>
          <input id="p-name" name="name" type="text" placeholder="e.g. Ankara Wrap Set" required />
        </div>
        <div className="field">
          <label htmlFor="p-price">
            Price <span className="hint">(₦)</span>
          </label>
          <input id="p-price" name="price" type="number" min="1" step="0.01" placeholder="18500" required />
        </div>
      </div>
      <div className="field">
        <label htmlFor="p-desc">
          Description <span className="hint">(optional)</span>
        </label>
        <textarea id="p-desc" name="description" rows={2} placeholder="What makes this product worth buying?" />
      </div>
      <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
        {loading ? 'Adding…' : 'Add Product'}
      </button>
      {error && (
        <div style={{ marginTop: 12, fontSize: 13, color: '#9A3B2E', background: '#FBEAE7', padding: 10, borderRadius: 10 }}>
          {error}
        </div>
      )}
    </form>
  );
}
