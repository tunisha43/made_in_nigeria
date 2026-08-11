import RegisterForm from '@/components/register/RegisterForm';
import { requireRole } from '@/lib/auth/requireRole';

export const metadata = {
  title: 'Register Your Business',
};

const STEPS = [
  { num: 1, title: 'Basic Registration', desc: 'Business name, location, and what you do.', active: true },
  { num: 2, title: 'Business Identity', desc: 'Logo, photos, and opening hours — build trust.', active: false },
  { num: 3, title: 'Services & Pricing', desc: 'Turn your listing into an income system.', active: false },
  { num: 4, title: 'Verification', desc: 'Confirm your location and documents to earn your badge.', active: false },
];

export default async function RegisterPage() {
  // Only business owners reach this page — AuthForm sends new business-owner
  // signups here directly. If someone signs up as another role and manually
  // types /register, this bounces them to "/" rather than showing the form.
  const { profile, user } = await requireRole(['business_owner']);

  return (
    <>
      <section className="page-header">
        <div className="wrap">
          <div className="eyebrow">Step 2 of 2 · Business Setup</div>
          <h1>Now, tell us about your business</h1>
          <p>
            You&apos;re signed in as <b>{profile.full_name || 'there'}</b>. This step is just about
            the business itself — your name and phone are already on file. Photos, pricing, and
            verification documents come later.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 52 }}>
        <div className="wrap form-shell">
          <div>
            <div className="steps">
              {STEPS.map((step) => (
                <div className={`step${step.active ? ' is-active' : ''}`} key={step.num}>
                  <div className="step-num">{step.num}</div>
                  <div>
                    <h5>{step.title}</h5>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="form-note">
              <span>&#9432;</span>
              <span>
                Made in Nigeria never fabricates verification. Your badge is earned as each step is
                confirmed — Registered → Verified → Advanced Verified.
              </span>
            </div>
          </div>

          <RegisterForm ownerId={user.id} />
        </div>
      </section>
    </>
  );
}
