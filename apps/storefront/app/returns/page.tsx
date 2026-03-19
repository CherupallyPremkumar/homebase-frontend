import type { Metadata } from 'next';
import { ReturnsClient } from './returns-client';

export const metadata: Metadata = { title: 'My Returns' };

export default function ReturnsPage() {
  return <ReturnsClient />;
}
