'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

const ROLES = ['Customer', 'Business Owner', 'Professional', 'Investor'];

interface AuthFormProps {
  startOnCreateTab: boolean;
  preselectBusiness: boolean;
}

export default function AuthForm({ startOnCreateTab, preselectBusiness }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'create'>(startOnCreateTab ? 'create' : 'signin');
  const [role, setRole] = useState(preselectBusiness ? 'Business Owner' : ROLES[0]);
  const [signinSubmitted, setSigninSubmitted] = useState(false);
  const [createSubmitted, setCreateSubmitted] = useState(false);

  function handleSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder for a real submit, e.g.:
    //   const { error } = await supabase.auth.signInWithPassword({ email, password })
    setSigninSubmitted(true);
  }

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Placeholder for a real submit, e.g.:
    //   const { error } = await supabase.auth.signUp({ email, password, options: { data: { role } } })
    setCreateSubmitted(true);
  }

  return (
    <div className="auth-form-wrap">
      <Link href="/" className="auth-back">
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Back to home
      </Link>

      <div className="auth-tabs">
        <button
          type="button"
          className={`tab${activeTab === 'signin' ? ' is-active' : ''}`}
          onClick={() => setActiveTab('signin')}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`tab${activeTab === 'create' ? ' is-active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Account
        </button>
      </div>

      {activeTab === 'signin' ? (
        <div>
          <h1>Welcome back</h1>
          <p>Sign in to your Made in Nigeria account.</p>

          <button className="oauth-btn" type="button">
            <svg width={17} height={17} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0012 23z" />
              <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 015.5 12c0-.73.13-1.44.34-2.09V7.06H2.18A11 11 0 001 12c0 1.77.42 3.45 1.18 4.94l3.66-2.85z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 00-9.82 6.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            Continue with Google
          </button>
          <div className="auth-divider">or sign in with email</div>

          <form onSubmit={handleSignIn}>
            <div className="field">
              <label htmlFor="si-email">Email or phone number</label>
              <input id="si-email" type="text" placeholder="you@email.com" required />
            </div>
            <div className="field">
              <label htmlFor="si-pass">Password</label>
              <input id="si-pass" type="password" placeholder="••••••••" required />
            </div>
            <div className="auth-row-between">
              <label className="field-check">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="link-gold">Forgot password?</a>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Sign In
            </button>
            {signinSubmitted && (
              <div style={{ marginTop: 16, textAlign: 'center', fontSize: 13.5, color: 'var(--forest-800)', background: 'var(--forest-050)', padding: 12, borderRadius: 10 }}>
                Signed in — you&apos;d land on your dashboard here.
              </div>
            )}
          </form>
          <p className="auth-switch">
            Don&apos;t have an account?{' '}
            <button type="button" className="link-gold" style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit' }} onClick={() => setActiveTab('create')}>
              Create one
            </button>
          </p>
        </div>
      ) : (
        <div>
          <h1>Join the movement</h1>
          <p>Create your account — no business builds alone.</p>

          <form onSubmit={handleCreate}>
            <div className="field">
              <label htmlFor="ca-name">Full name</label>
              <input id="ca-name" type="text" placeholder="e.g. Adaeze Nwosu" required />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="ca-email">Email</label>
                <input id="ca-email" type="email" placeholder="you@email.com" required />
              </div>
              <div className="field">
                <label htmlFor="ca-phone">Phone</label>
                <input id="ca-phone" type="tel" placeholder="+234 800 000 0000" required />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="ca-pass">Password</label>
                <input id="ca-pass" type="password" placeholder="••••••••" required />
              </div>
              <div className="field">
                <label htmlFor="ca-pass2">Confirm password</label>
                <input id="ca-pass2" type="password" placeholder="••••••••" required />
              </div>
            </div>

            <div className="field">
              <label>
                I&apos;m joining as a… <span className="hint">(you can add a second role later)</span>
              </label>
              <div className="pill-select">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`pill-opt${role === r ? ' is-active' : ''}`}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <label className="field-check" style={{ marginBottom: 20 }}>
              <input type="checkbox" required />
              I agree to the <a href="/legal" className="link-gold">Terms &amp; Standards</a> and{' '}
              <a href="/legal" className="link-gold">Privacy Policy</a>
            </label>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Create Account
            </button>
            {createSubmitted && (
              <div style={{ marginTop: 16, textAlign: 'center', fontSize: 13.5, color: 'var(--forest-800)', background: 'var(--forest-050)', padding: 12, borderRadius: 10 }}>
                {role === 'Business Owner' ? (
                  <>Account created. Next: <Link href="/register" className="link-gold">tell us about your business →</Link></>
                ) : (
                  <>Account created — you&apos;d be routed to onboarding for your role next.</>
                )}
              </div>
            )}
          </form>
          <p className="auth-switch">
            Already have an account?{' '}
            <button type="button" className="link-gold" style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit' }} onClick={() => setActiveTab('signin')}>
              Sign in
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
