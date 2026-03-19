'use client';

import { use } from 'react';
import { OrderDetail } from '@/features/order/ui';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <OrderDetail id={id} />;
}
