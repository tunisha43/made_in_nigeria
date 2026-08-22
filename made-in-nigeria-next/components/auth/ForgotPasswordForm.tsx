'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordForm() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError(null);
    const origin = window.location.origin;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${origin}/auth/reset-password` });
    if (resetError) setError(resetError.message); else setSent(true);
    setLoading(false);
  }

  return <div className="auth-form-wrap">
    <Link href="/auth" className="auth-back">← Back to sign in</Link>
    <h1>Reset your password</h1>
    <p>Enter the email address on your account and we&apos;ll send you a secure password reset link.</p>
    {sent ? <div style={{ marginTop: 22, color: 'var(--forest-800)', background: 'var(--forest-050)', padding: 14, borderRadius: 12, fontSize: 13.5 }}>Check your inbox for the password reset link. If you don&apos;t see it, check your spam folder.</div> : <form onSubmit={submit} style={{ marginTop: 24 }}>
      <div className="field"><label htmlFor="reset-email">Email</label><input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required /></div>
      <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
      {error && <div style={{ marginTop: 16, color: '#9A3B2E', background: '#FBEAE7', padding: 12, borderRadius: 10, fontSize: 13.5 }}>{error}</div>}
    </form>}
  </div>;
}
