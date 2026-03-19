'use client';

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@homebase/api-client';
import { SectionSkeleton, ErrorSection, CACHE_TIMES } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Button, Separator, Avatar, AvatarFallback } from '@homebase/ui';
import { MapPin, Mail, Phone, Edit } from 'lucide-react';

export function ProfileClient() {
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

      {/* Addresses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Addresses</CardTitle>
          <Button variant="outline" size="sm">Add Address</Button>
        </CardHeader>
        <CardContent>
          {user.addresses.length === 0 ? (
            <p className="text-sm text-gray-500">No addresses saved yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {user.addresses.map((addr) => (
                <div key={addr.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div className="text-sm">
                        <p className="font-medium">{addr.fullName}</p>
                        <p className="text-gray-500">{addr.addressLine1}</p>
                        {addr.addressLine2 && <p className="text-gray-500">{addr.addressLine2}</p>}
                        <p className="text-gray-500">{addr.city}, {addr.state} {addr.pincode}</p>
                        <p className="text-gray-500">{addr.phone}</p>
                      </div>
                    </div>
                    {addr.isDefault && (
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Default</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
