'use client';

import { use } from 'react';
import { ProductDetail } from '@/features/product/components';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ProductDetail id={id} />;
}
