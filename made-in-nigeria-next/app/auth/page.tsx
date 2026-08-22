import Link from 'next/link';
import AuthForm from '@/components/auth/AuthForm';

export const metadata = {
  title: 'Sign In',
};

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const isBusinessRole = role === 'business';

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-top">
          <Link href="/" className="logo">
            <span className="script">Made in</span>
            <span className="bold">NIGERIA</span>
          </Link>
        </div>
        <div>
          <p className="auth-quote">&quot;No business builds alone. Yours doesn&apos;t have to either.&quot;</p>
          <div className="auth-quote-attr">AFRICA&apos;S BUSINESS GROWTH ECOSYSTEM</div>
        </div>
        <div className="auth-brand-stamps" aria-hidden="true">
          <div className="stamp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="stamp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" /></svg>
          </div>
          <div className="stamp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M10 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <AuthForm startOnCreateTab={isBusinessRole} preselectBusiness={isBusinessRole} />
      </div>
    </div>
  );
}
