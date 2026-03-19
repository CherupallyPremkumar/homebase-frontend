'use client';
import { use } from 'react';
import { CountExecution } from '@/features/cycle-count/ui';
export default function CountExecutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <CountExecution taskId={id} />;
}
