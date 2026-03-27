import type { Metadata } from 'next';
import { OrderTracking } from '@/features/order/ui';

export const metadata: Metadata = { title: 'Track Order' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderTrackPage({ params }: Props) {
  const { id } = await params;
  return <OrderTracking orderId={id} />;
}
