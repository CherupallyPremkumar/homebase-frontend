import type { Metadata } from 'next';
import { OrderDetail } from '@/features/order/ui';

export const metadata: Metadata = { title: 'Order Details' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  return <OrderDetail orderId={id} />;
}
