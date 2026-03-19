'use client';

import { EntityDetailLayout, SectionSkeleton, ErrorSection, formatPriceRupees, formatDate } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Separator, Badge } from '@homebase/ui';
import { useOrderDetail, useOrderMutation } from '../api/queries';

interface OrderDetailProps {
  id: string;
}

export function OrderDetail({ id }: OrderDetailProps) {
  const { data, isLoading, error, refetch } = useOrderDetail(id);
  const mutation = useOrderMutation();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const order = data.mutatedEntity;

  return (
    <EntityDetailLayout
      breadcrumbs={[{ label: 'Orders', href: '/orders' }, { label: `#${order.orderNumber}` }]}
      title={`Order #${order.orderNumber}`}
      subtitle={formatDate(order.createdTime)}
      state={order.stateId}
      allowedActions={data.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id, eventId })}
      actionLoading={mutation.isPending}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Order items */}
        <Card>
          <CardHeader><CardTitle>Items</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-gray-500">SKU: {item.sku} | Qty: {item.quantity}</p>
                </div>
                <span className="font-medium">{formatPriceRupees(item.totalPrice)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPriceRupees(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Shipping address */}
        <Card>
          <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
          <CardContent className="text-sm">
            {order.shippingAddress ? (
              <>
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-gray-500">{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-gray-500">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-gray-500">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                </p>
                <p className="text-gray-500">{order.shippingAddress.phone}</p>
              </>
            ) : (
              <p className="text-gray-500">No shipping address</p>
            )}
          </CardContent>
        </Card>

        {/* Payment info */}
        <Card>
          <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Payment ID</span>
              <span className="font-medium">{order.paymentId || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="font-medium">{order.paymentMethod || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Activity timeline */}
        <Card>
          <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
          <CardContent>
            {order.activities?.length ? (
              <div className="space-y-3">
                {order.activities.map((activity, i) => (
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
