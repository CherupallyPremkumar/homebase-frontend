'use client';

import Link from 'next/link';
import { EntityDetailLayout, SectionSkeleton, ErrorSection, formatPriceRupees, formatDate } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { useReturnDetail, useReturnMutation } from '../api/queries';

interface ReturnDetailProps {
  id: string;
}

export function ReturnDetail({ id }: ReturnDetailProps) {
  const { data, isLoading, error, refetch } = useReturnDetail(id);
  const mutation = useReturnMutation();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const returnReq = data.mutatedEntity;

  return (
    <EntityDetailLayout
      breadcrumbs={[{ label: 'Returns', href: '/oms/returns' }, { label: returnReq.id.slice(0, 8) }]}
      title={`Return Request`}
      subtitle={formatDate(returnReq.createdTime)}
      state={returnReq.stateId}
      allowedActions={data.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id, eventId })}
      actionLoading={mutation.isPending}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Return Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Product</span>
              <span className="font-medium">{returnReq.productName || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Customer</span>
              <span className="font-medium">{returnReq.userId || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Reason</span>
              <span className="font-medium">{returnReq.reason || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Quantity</span>
              <span className="font-medium">{returnReq.quantity ?? 1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Order</span>
              <Link href={`/oms/orders/${returnReq.orderId}`} className="font-medium text-primary hover:underline">
                View Order
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Refund</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Refund Amount</span>
              <span className="text-lg font-bold text-green-600">
                {returnReq.refundAmount ? formatPriceRupees(returnReq.refundAmount) : 'Pending'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Refund Method</span>
              <span className="font-medium">{returnReq.refundMethod || 'Original payment method'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
          <CardContent>
            {returnReq.activities?.length ? (
              <div className="space-y-3">
                {returnReq.activities.map((activity, i) => (
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
