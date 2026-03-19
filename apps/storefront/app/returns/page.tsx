import type { Metadata } from 'next';
import { ReturnList } from '@/features/return/ui';

export const metadata: Metadata = { title: 'My Returns' };

export default function ReturnsPage() {
  return <ReturnList />;
}
