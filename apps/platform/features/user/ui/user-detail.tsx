'use client';

import { EntityDetailLayout, SectionSkeleton, ErrorSection, formatDate } from '@homebase/shared';
import { Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from '@homebase/ui';
import { useUserDetail, useUserMutation } from '../api/queries';

interface UserDetailProps {
  id: string;
}

export function UserDetail({ id }: UserDetailProps) {
  const { data, isLoading, error, refetch } = useUserDetail(id);
  const mutation = useUserMutation();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const user = data.mutatedEntity;

  return (
    <EntityDetailLayout
      breadcrumbs={[
        { label: 'Users', href: '/users' },
        { label: `${user.firstName} ${user.lastName}` },
      ]}
      title={`${user.firstName} ${user.lastName}`}
      subtitle={user.email}
      state={user.stateId}
      allowedActions={data.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id, eventId })}
      actionLoading={mutation.isPending}
    >
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              <div><p className="text-sm text-gray-500">First Name</p><p className="font-medium">{user.firstName}</p></div>
              <div><p className="text-sm text-gray-500">Last Name</p><p className="font-medium">{user.lastName}</p></div>
              <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{user.email}</p></div>
              <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{user.phone || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Joined</p><p className="font-medium">{formatDate(user.createdTime)}</p></div>
              <div><p className="text-sm text-gray-500">Last Modified</p><p className="font-medium">{formatDate(user.lastModifiedTime)}</p></div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="addresses" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {user.addresses?.length ? (
                <div className="space-y-3">
                  {user.addresses.map((addr, i) => (
                    <div key={i} className="rounded border p-3 text-sm">
                      <p className="font-medium">{addr.fullName || `Address ${i + 1}`}</p>
                      <p className="text-gray-500">{addr.addressLine1}</p>
                      {addr.addressLine2 && <p className="text-gray-500">{addr.addressLine2}</p>}
                      <p className="text-gray-500">{addr.city}, {addr.state} {addr.pincode}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No addresses</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {user.activities?.length ? (
                <div className="space-y-3">
                  {user.activities.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
                      <div>
                        <p className="font-medium">{a.name}</p>
                        {a.comment && <p className="text-gray-500">{a.comment}</p>}
                        <p className="text-xs text-gray-400">{a.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No activity</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </EntityDetailLayout>
  );
}
