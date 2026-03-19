'use client';

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@homebase/api-client';
import { SectionSkeleton, ErrorSection, CACHE_TIMES } from '@homebase/shared';
import { Card, CardContent, Button, Avatar, AvatarFallback } from '@homebase/ui';
import { Mail, Phone, Edit } from 'lucide-react';
import { AddressList } from './address-list';

export function ProfilePage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => usersApi.getProfile(),
    ...CACHE_TIMES.userProfile,
  });

  if (isLoading) return <div className="container mx-auto px-4 py-6"><SectionSkeleton rows={4} /></div>;
  if (error) return <div className="container mx-auto px-4 py-6"><ErrorSection error={error} onRetry={() => refetch()} /></div>;
  if (!data) return null;

  const user = data.mutatedEntity;

  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{user.firstName} {user.lastName}</h2>
            <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{user.email}</span>
              {user.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{user.phone}</span>}
            </div>
          </div>
          <Button variant="outline" size="sm"><Edit className="mr-1 h-3.5 w-3.5" />Edit</Button>
        </CardContent>
      </Card>

      <AddressList addresses={user.addresses} />
    </div>
  );
}
