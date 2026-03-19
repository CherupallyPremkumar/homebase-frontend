'use client';

import { use } from 'react';
import { PaymentDetail } from '@/features/payments/ui';

export default function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PaymentDetail id={id} />;
}
