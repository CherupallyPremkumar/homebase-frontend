'use client';

import Link from 'next/link';
import { EntityDetailLayout, SectionSkeleton, ErrorSection, formatDate } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Separator } from '@homebase/ui';
import { useFulfillmentDetail, useFulfillmentMutation } from '../api/queries';

interface FulfillmentDetailProps {
  id: string;
}

export function FulfillmentDetail({ id }: FulfillmentDetailProps) {
  const { data, isLoading, error, refetch } = useFulfillmentDetail(id);
  const mutation = useFulfillmentMutation();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const fulfillment = data.mutatedEntity;

  return (
    <EntityDetailLayout
      breadcrumbs={[{ label: 'Fulfillment', href: '/fulfillment' }, { label: fulfillment.id.slice(0, 8) }]}
      title={`Fulfillment Order`}
      subtitle={`Order: ${fulfillment.orderId}`}
      state={fulfillment.stateId}
      allowedActions={data.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id, eventId })}
      actionLoading={mutation.isPending}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Fulfillment info */}
        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Warehouse</span>
              <span className="font-medium">{fulfillment.warehouseId || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Carrier</span>
              <span className="font-medium">{fulfillment.carrier || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Order</span>
              <Link href={`/orders/${fulfillment.orderId}`} className="font-medium text-primary hover:underline">
                View Order
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Created</span>
              <span className="font-medium">{formatDate(fulfillment.createdTime)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Line items with pick/pack status */}
        <Card>
          <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {fulfillment.lineItems.map((item, i) => (
              <div key={i} className="text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{item.productName || item.productId}</span>
                  <span className="text-gray-500">Qty: {item.quantity}</span>
                </div>
                <div className="mt-1 flex gap-4 text-xs text-gray-500">
                  <span>Picked: {item.pickedQuantity ?? 0}/{item.quantity}</span>
                  <span>Packed: {item.packedQuantity ?? 0}/{item.quantity}</span>
                </div>
                {i < fulfillment.lineItems.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activity */}
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
          <CardContent>
            {fulfillment.activities?.length ? (
              <div className="space-y-3">
                {fulfillment.activities.map((activity, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      {activity.comment && <p className="text-gray-500">{activity.comment}</p>}
                      <p className="text-xs text-gray-400">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No activity recorded</p>
            )}
          </CardContent>
        </Card>
      </div>
    </EntityDetailLayout>
  );
}
