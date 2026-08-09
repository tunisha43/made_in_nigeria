import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Wraps every "public marketing site" page — Home, Our Story, Marketplace,
// Product Detail, Business Profile, Register, Community Hub, Events,
// Trust & Verification, National Hub, Legal — with the shared nav + footer.
// Auth and the dashboard shells (business/customer/investor/admin) live
// outside this group because they use different chrome entirely.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
