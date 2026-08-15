'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface SettingsFormProps {
  userId: string;
  currentFullName: string;
  currentEmail: string;
}

export default function SettingsForm({ userId, currentFullName, currentEmail }: SettingsFormProps) {
  const router = useRouter();
  const supabase = createClient();

  // --- Profile (name) ---
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSaved, setNameSaved] = useState(false);

  async function handleNameSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNameError(null);
    setNameSaved(false);
    setNameLoading(true);

    const form = new FormData(e.currentTarget);
    const fullName = String(form.get('full_name') ?? '').trim();

    if (!fullName) {
      setNameError('Name cannot be empty.');
      setNameLoading(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('profiles') as any).update({ full_name: fullName }).eq('id', userId);

    if (error) {
      setNameError(error.message);
      setNameLoading(false);
      return;
    }

    setNameLoading(false);
    setNameSaved(true);
    router.refresh();
  }

  // --- Email ---
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSaved, setEmailSaved] = useState(false);

  async function handleEmailSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailError(null);
    setEmailSaved(false);
    setEmailLoading(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get('email') ?? '').trim();

    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      setEmailError(error.message);
      setEmailLoading(false);
      return;
    }

    setEmailLoading(false);
    setEmailSaved(true);
  }

  // --- Password ---
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSaved, setPwSaved] = useState(false);

  async function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwError(null);
    setPwSaved(false);
    setPwLoading(true);

    const form = new FormData(e.currentTarget);
    const password = String(form.get('password') ?? '');
    const confirmPassword = String(form.get('confirm_password') ?? '');

    if (password.length < 6) {
      setPwError('Password must be at least 6 characters.');
      setPwLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setPwError('Passwords do not match.');
      setPwLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setPwError(error.message);
      setPwLoading(false);
      return;
    }

    setPwLoading(false);
    setPwSaved(true);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      <div className="widget span-4">
        <div className="widget-head"><h3>Name</h3></div>
        <form onSubmit={handleNameSubmit}>
          <div className="field">
            <label htmlFor="full_name">Full name</label>
            <input id="full_name" name="full_name" type="text" defaultValue={currentFullName} required />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={nameLoading}>
            {nameLoading ? 'Saving…' : 'Save Name'}
          </button>
          {nameError && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#9A3B2E', background: '#FBEAE7', padding: 10, borderRadius: 10 }}>
              {nameError}
            </div>
          )}
          {nameSaved && !nameError && (
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--forest-800)', background: 'var(--forest-050)', padding: 10, borderRadius: 10 }}>
              Name updated.
            </div>
          )}
        </form>
      </div>

      <div className="widget span-4">
        <div className="widget-head"><h3>Email</h3></div>
        <form onSubmit={handleEmailSubmit}>
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" defaultValue={currentEmail} required />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={emailLoading}>
            {emailLoading ? 'Saving…' : 'Save Email'}
          </button>
          {emailError && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#9A3B2E', background: '#FBEAE7', padding: 10, borderRadius: 10 }}>
              {emailError}
            </div>
          )}
          {emailSaved && !emailError && (
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--forest-800)', background: 'var(--forest-050)', padding: 10, borderRadius: 10 }}>
              Check your inbox to confirm the new email address before it takes effect.
            </div>
          )}
        </form>
      </div>

      <div className="widget span-4">
        <div className="widget-head"><h3>Password</h3></div>
        <form onSubmit={handlePasswordSubmit}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="password">New password</label>
              <input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} />
            </div>
            <div className="field">
              <label htmlFor="confirm_password">Confirm new password</label>
              <input id="confirm_password" name="confirm_password" type="password" placeholder="••••••••" required minLength={6} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={pwLoading}>
            {pwLoading ? 'Saving…' : 'Update Password'}
          </button>
          {pwError && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#9A3B2E', background: '#FBEAE7', padding: 10, borderRadius: 10 }}>
              {pwError}
            </div>
          )}
          {pwSaved && !pwError && (
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--forest-800)', background: 'var(--forest-050)', padding: 10, borderRadius: 10 }}>
              Password updated.
            </div>
          )}
        </form>
      </div>
    </>
  );
}
