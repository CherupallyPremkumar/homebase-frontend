'use client';

import { use } from 'react';
import { SellerProductDetail } from '@/features/product/ui';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <SellerProductDetail productId={id} />;
}
