'use client';

import { use } from 'react';
import { ReconciliationDetail } from '@/features/reconciliation/ui';

export default function ReconciliationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ReconciliationDetail id={id} />;
}
