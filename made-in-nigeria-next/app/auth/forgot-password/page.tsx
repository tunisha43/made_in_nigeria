import Link from 'next/link';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata = { title: 'Forgot Password' };

export default function ForgotPasswordPage() {
  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-top"><Link href="/" className="logo"><span className="script">Made in</span><span className="bold">NIGERIA</span></Link></div>
        <div><p className="auth-quote">&quot;No business builds alone. Yours doesn&apos;t have to either.&quot;</p><div className="auth-quote-attr">AFRICA&apos;S BUSINESS GROWTH ECOSYSTEM</div></div>
      </div>
      <div className="auth-form-side"><ForgotPasswordForm /></div>
    </div>
  );
}
