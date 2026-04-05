import type { Metadata } from 'next';
import { ProfilePage as ProfilePageClient } from '@/features/user/ui';

export const metadata: Metadata = { title: 'My Account' };

export default function ProfilePage() {
  return <ProfilePageClient />;
}
