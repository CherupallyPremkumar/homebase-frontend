'use client';

import { use } from 'react';
import { ReturnDetail } from '@/features/oms/returns/ui';

export default function ReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ReturnDetail id={id} />;
}
