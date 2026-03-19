'use client';

import { use } from 'react';
import { TicketDetail } from '@/features/support/ui';

export default function SupportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <TicketDetail id={id} />;
}
