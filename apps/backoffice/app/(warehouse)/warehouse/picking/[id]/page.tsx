'use client';

import { use } from 'react';
import { PickExecution } from '@/features/warehouse/picking/ui';

export default function PickExecutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PickExecution pickListId={id} />;
}
