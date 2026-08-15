'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type BusinessInsert = Database['public']['Tables']['businesses']['Insert'];

const BUSINESS_TYPES = ['Tailoring', 'Farming', 'Cooking', 'Construction', 'Trading', 'Manufacturing', 'Services'];
const STATES = ['Abia', 'Bayelsa', 'Lagos', 'Rivers', 'Akwa Ibom', 'Enugu', 'Other'];

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  // Random suffix to reduce collision risk without an extra lookup query --
  // slug has a UNIQUE constraint in the database, so a collision just
  // surfaces as a normal error the person can retry.
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}-${suffix}`;
}

function generateMinId(): string {
  // TODO: this should be a server-assigned sequential ID once real
  // verification review exists, not a client-generated random number.
  // Fine as a placeholder for now since nothing downstream depends on
  // MIN IDs being sequential -- only unique.
  const digits = Math.floor(10000000 + Math.random() * 89999999);
  return `MIN-NG-${digits}`;
}

interface RegisterFormProps {
  ownerId: string;
}

export default function RegisterForm({ ownerId }: RegisterFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = String(form.get('bizname') ?? '').trim();
    const city = String(form.get('city') ?? '').trim();
    const state = String(form.get('state') ?? '');
    const description = String(form.get('desc') ?? '').trim();

    const payload: BusinessInsert = {
      owner_id: ownerId,
      name,
      category: businessType,
      city,
      state,
      description: description || null,
      slug: slugify(name),
      min_id: generateMinId(),
      verification_level: 'registered',
    };

    // Cast at the call site rather than trusting supabase-js's generic
    // resolution here -- see the long comment in types/database.ts and
    // lib/auth/requireRole.ts. `payload` above is still fully checked
    // against the real Insert shape; only the call itself bypasses
    // whatever the client's generic chain does with it. `as any` (not
    // `as never`) here deliberately -- `never` fails to compile against a
    // concrete object type ("insufficient overlap"), `any` doesn't.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase.from('businesses') as any).insert(payload);

    if (insertError) {
      setError(
        insertError.code === '23505'
          ? 'That business name produced a duplicate ID — please try again.'
          : insertError.message
      );
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
    // Give the person a moment to see the success message before moving on.
    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 1200);
  }

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="bizname">Business name</label>
          <input id="bizname" name="bizname" type="text" placeholder="e.g. Adaeze Textiles" required />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="city">
              Location <span className="hint">(city / village)</span>
            </label>
            <input id="city" name="city" type="text" placeholder="e.g. Aba" required />
          </div>
          <div className="field">
            <label htmlFor="state">State</label>
            <select id="state" name="state" required defaultValue="">
              <option value="" disabled>Select state</option>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label>Type of business</label>
          <div className="pill-select">
            {BUSINESS_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={`pill-opt${businessType === type ? ' is-active' : ''}`}
                onClick={() => setBusinessType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="desc">
            Short description <span className="hint">(what do you do?)</span>
          </label>
          <textarea
            id="desc"
            name="desc"
            rows={3}
            placeholder="Tell us in a sentence or two — this becomes the first thing customers read."
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}
          disabled={loading}
        >
          {loading ? 'Creating…' : 'Create My Business Profile Draft'}
        </button>

        {error && (
          <div
            style={{
              marginTop: 18,
              textAlign: 'center',
              fontSize: 13.5,
              color: '#9A3B2E',
              background: '#FBEAE7',
              padding: 14,
              borderRadius: 12,
            }}
          >
            {error}
          </div>
        )}

        {submitted && (
          <div
            style={{
              marginTop: 18,
              textAlign: 'center',
              fontSize: 13.5,
              color: 'var(--forest-800)',
              background: 'var(--forest-050)',
              padding: 14,
              borderRadius: 12,
            }}
          >
            Draft created. Taking you to your dashboard…
          </div>
        )}
      </form>
    </div>
  );
}
