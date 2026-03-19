import type { Metadata } from 'next';
import { CheckoutPage } from '@/features/checkout/ui';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
