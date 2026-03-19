'use client';

import { use } from 'react';
import { SupplierDetail } from '@/features/supplier/ui';

export default function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <SupplierDetail id={id} />;
}
