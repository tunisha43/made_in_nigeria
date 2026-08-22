import CartClient from '@/components/cart/CartClient';

export const metadata = { title: 'Your Cart' };

export default function CartPage() {
  return <><section className="page-header"><div className="wrap"><div className="eyebrow">Marketplace</div><h1>Your cart</h1><p>Review your selected products before checkout.</p></div></section><section className="section" style={{ paddingTop: 36 }}><div className="wrap"><CartClient /></div></section></>;
}
