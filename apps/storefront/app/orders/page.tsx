import type { Metadata } from 'next';
import { OrdersClient } from './orders-client';

export const metadata: Metadata = { title: 'My Orders' };

export default function OrdersPage() {
  return <OrdersClient />;
}
