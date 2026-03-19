'use client';
import { use } from 'react';
import { SellerSettlementDetail } from '@/features/settlement/ui';
export default function SettlementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <SellerSettlementDetail settlementId={id} />;
}
