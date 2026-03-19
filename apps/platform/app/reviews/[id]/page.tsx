'use client';

import { use } from 'react';
import { ReviewDetail } from '@/features/review/ui';

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ReviewDetail id={id} />;
}
