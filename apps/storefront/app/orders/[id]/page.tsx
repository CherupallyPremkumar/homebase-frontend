import type { Metadata } from 'next';
import { OrderDetailClient } from './order-detail-client';

export const metadata: Metadata = { title: 'Order Details' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  return <OrderDetailClient orderId={id} />;
}
