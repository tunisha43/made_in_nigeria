'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ResetPasswordForm() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(null);
    if (password.length < 8) { setError('Your new password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('The passwords do not match.'); return; }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) setError(updateError.message); else { setDone(true); setTimeout(() => { router.push('/auth'); router.refresh(); }, 1200); }
    setLoading(false);
  }

  return <div className="auth-form-wrap">
    <Link href="/auth" className="auth-back">← Back to sign in</Link>
    <h1>Create a new password</h1>
    <p>Choose a strong password you haven&apos;t used elsewhere.</p>
    {done ? <div style={{ marginTop: 22, color: 'var(--forest-800)', background: 'var(--forest-050)', padding: 14, borderRadius: 12, fontSize: 13.5 }}>Password updated successfully. Taking you back to sign in…</div> : <form onSubmit={submit} style={{ marginTop: 24 }}>
      <div className="field"><label htmlFor="new-password">New password</label><input id="new-password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required /></div>
      <div className="field"><label htmlFor="confirm-password">Confirm password</label><input id="confirm-password" type="password" minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" required /></div>
      <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>{loading ? 'Updating…' : 'Update password'}</button>
      {error && <div style={{ marginTop: 16, color: '#9A3B2E', background: '#FBEAE7', padding: 12, borderRadius: 10, fontSize: 13.5 }}>{error}</div>}
    </form>}
  </div>;
}
