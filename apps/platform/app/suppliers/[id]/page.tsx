'use client';

import { use } from 'react';
import { SupplierDetail } from '@/features/supplier/components';

export default function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <SupplierDetail id={id} />;
}
