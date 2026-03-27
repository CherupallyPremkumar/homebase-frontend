'use client';
import { use } from 'react';
import { PackStation } from '@/features/warehouse/packing/ui';
export default function PackStationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PackStation taskId={id} />;
}
