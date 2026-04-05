'use client';

import { use } from 'react';
import { RulesetDetail } from '@/features/rules-engine/components';

export default function RulesetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RulesetDetail id={id} />;
}
