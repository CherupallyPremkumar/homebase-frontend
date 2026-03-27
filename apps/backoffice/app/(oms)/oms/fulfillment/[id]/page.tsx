'use client';

import { use } from 'react';
import { FulfillmentDetail } from '@/features/oms/fulfillment/ui';

export default function FulfillmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <FulfillmentDetail id={id} />;
}
