'use client';

import { use } from 'react';
import { SellerOrderDetail } from '@/features/order/ui';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <SellerOrderDetail orderId={id} />;
}
