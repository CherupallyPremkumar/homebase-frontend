'use client';

import { use } from 'react';
import { UserDetail } from '@/features/user/components';

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <UserDetail id={id} />;
}
