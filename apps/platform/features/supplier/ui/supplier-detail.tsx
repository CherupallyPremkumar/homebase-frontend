'use client';

import { EntityDetailLayout, SectionSkeleton, ErrorSection, formatDate } from '@homebase/shared';
import { Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from '@homebase/ui';
import { useSupplierDetail, useSupplierMutation } from '../api/queries';

interface SupplierDetailProps {
  id: string;
}

export function SupplierDetail({ id }: SupplierDetailProps) {
  const { data, isLoading, error, refetch } = useSupplierDetail(id);
  const mutation = useSupplierMutation();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const supplier = data.mutatedEntity;

  return (
    <EntityDetailLayout
      breadcrumbs={[
        { label: 'Suppliers', href: '/suppliers' },
        { label: supplier.businessName },
      ]}
      title={supplier.businessName}
      subtitle={`Contact: ${supplier.contactPerson || 'N/A'}`}
      state={supplier.stateId}
      allowedActions={data.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id, eventId })}
      actionLoading={mutation.isPending}
    >
      <Tabs defaultValue="business">
        <TabsList>
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="business" className="mt-4">
          <Card>
            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              <div><p className="text-sm text-gray-500">Business Name</p><p className="font-medium">{supplier.businessName}</p></div>
              <div><p className="text-sm text-gray-500">Contact Person</p><p className="font-medium">{supplier.contactPerson || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{supplier.email || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{supplier.phone || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Tax ID</p><p className="font-medium">{supplier.taxId || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-500">Joined</p><p className="font-medium">{formatDate(supplier.createdTime)}</p></div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardContent className="grid gap-4 p-6 md:grid-cols-3">
              <div className="rounded border p-4 text-center">
                <p className="text-sm text-gray-500">Rating</p>
                <p className="mt-1 text-2xl font-bold">{supplier.rating ? `${supplier.rating.toFixed(1)}` : 'N/A'}</p>
              </div>
              <div className="rounded border p-4 text-center">
                <p className="text-sm text-gray-500">Products</p>
                <p className="mt-1 text-2xl font-bold">{supplier.productCount ?? 0}</p>
              </div>
              <div className="rounded border p-4 text-center">
                <p className="text-sm text-gray-500">Performance Score</p>
                <p className="mt-1 text-2xl font-bold">{supplier.performanceScore ? `${supplier.performanceScore}%` : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {supplier.activities?.length ? (
                <div className="space-y-3">
                  {supplier.activities.map((a, i) => (
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
