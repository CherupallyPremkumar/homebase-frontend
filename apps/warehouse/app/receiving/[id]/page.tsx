'use client';

import { use } from 'react';
import { ReceivingDetail } from '@/features/receiving/ui';

export default function ReceivingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ReceivingDetail shipmentId={id} />;
}
