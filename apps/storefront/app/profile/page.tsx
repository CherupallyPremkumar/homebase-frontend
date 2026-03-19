import type { Metadata } from 'next';
import { ProfilePage as ProfilePageClient } from '@/features/user/ui';

export const metadata: Metadata = { title: 'My Profile' };

export default function ProfilePage() {
  return <ProfilePageClient />;
}
