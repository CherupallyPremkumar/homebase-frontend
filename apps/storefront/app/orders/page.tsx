import type { Metadata } from 'next';
import { OrderList } from '@/features/order/ui';

export const metadata: Metadata = { title: 'My Orders' };

export default function OrdersPage() {
  return <OrderList />;
}
