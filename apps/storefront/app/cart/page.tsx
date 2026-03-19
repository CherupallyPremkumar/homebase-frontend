import type { Metadata } from 'next';
import { CartPage as CartPageClient } from '@/features/cart/ui';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartPageClient />;
}
