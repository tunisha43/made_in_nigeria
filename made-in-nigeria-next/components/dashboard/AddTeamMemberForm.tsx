'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface AddTeamMemberFormProps {
  businessId: string;
}

export default function AddTeamMemberForm({ businessId }: AddTeamMemberFormProps) {
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
    const position = String(form.get('position') ?? '').trim();
    const phone = String(form.get('phone') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const startDate = String(form.get('start_date') ?? '');

    if (!name || !position || !startDate) {
      setError('Name, position, and start date are required.');
      setLoading(false);
      return;
    }

    const payload = {
      business_id: businessId,
      name,
      position,
      phone: phone || null,
      email: email || null,
      start_date: startDate,
    };

    // Cast at the call site rather than trusting supabase-js's generic
    // resolution here -- see the long comment in types/database.ts and
    // lib/auth/requireRole.ts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase.from('team_members') as any).insert(payload);

    if (insertError) {
      setError(insertError.message);
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
          <label htmlFor="tm-name">Full name</label>
          <input id="tm-name" name="name" type="text" placeholder="e.g. Kelechi Uba" required />
        </div>
        <div className="field">
          <label htmlFor="tm-position">Position</label>
          <input id="tm-position" name="position" type="text" placeholder="e.g. Fulfillment" required />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="tm-phone">
            Phone <span className="hint">(optional)</span>
          </label>
          <input id="tm-phone" name="phone" type="tel" placeholder="+234 800 000 0000" />
        </div>
        <div className="field">
          <label htmlFor="tm-email">
            Email <span className="hint">(optional)</span>
          </label>
          <input id="tm-email" name="email" type="email" placeholder="kelechi@email.com" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="tm-start">Start date</label>
        <input id="tm-start" name="start_date" type="date" required />
      </div>
      <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
        {loading ? 'Adding…' : 'Add Team Member'}
      </button>
      {error && (
        <div style={{ marginTop: 12, fontSize: 13, color: '#9A3B2E', background: '#FBEAE7', padding: 10, borderRadius: 10 }}>
          {error}
        </div>
      )}
    </form>
  );
}
