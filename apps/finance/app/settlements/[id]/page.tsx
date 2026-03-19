'use client';

import { use } from 'react';
import { SettlementDetail } from '@/features/settlement/ui';

export default function SettlementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <SettlementDetail id={id} />;
}
