import Link from 'next/link';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata = { title: 'Create New Password' };

export default function ResetPasswordPage() {
  return <div className="auth-shell"><div className="auth-brand"><div className="auth-brand-top"><Link href="/" className="logo"><span className="script">Made in</span><span className="bold">NIGERIA</span></Link></div><div><p className="auth-quote">&quot;No business builds alone. Yours doesn&apos;t have to either.&quot;</p><div className="auth-quote-attr">AFRICA&apos;S BUSINESS GROWTH ECOSYSTEM</div></div></div><div className="auth-form-side"><ResetPasswordForm /></div></div>;
}
