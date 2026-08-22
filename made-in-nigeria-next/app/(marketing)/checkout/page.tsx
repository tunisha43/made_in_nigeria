import CheckoutClient from '@/components/cart/CheckoutClient';
export const metadata = { title: 'Checkout' };
export default function CheckoutPage() { return <><section className="page-header"><div className="wrap"><div className="eyebrow">Secure checkout</div><h1>Complete your order</h1><p>Your order stays tied to verified marketplace businesses from start to finish.</p></div></section><section className="section" style={{ paddingTop: 36 }}><div className="wrap"><CheckoutClient /></div></section></>; }
