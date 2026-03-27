'use client';

import { use } from 'react';
import { ShipmentDetail } from '@/features/oms/shipping/ui';

export default function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ShipmentDetail id={id} />;
}
