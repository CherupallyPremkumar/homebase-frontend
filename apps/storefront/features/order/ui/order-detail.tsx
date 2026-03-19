'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@homebase/api-client';
import { useStmMutation, EntityDetailLayout, StateBadge, PriceDisplay, SectionSkeleton, ErrorSection, formatDate, formatPriceRupees, CACHE_TIMES } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Separator } from '@homebase/ui';
import type { Order } from '@homebase/types';
import { OrderStatusTimeline } from './order-status-timeline';

export function OrderDetail({ orderId }: { orderId: string }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => ordersApi.getById(orderId),
    ...CACHE_TIMES.orderDetail,
  });

  const mutation = useStmMutation<Order>({
    entityType: 'orders',
    mutationFn: ordersApi.processEvent,
  });

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const order = data.mutatedEntity;

  return (
    <div className="container mx-auto px-4 py-6">
      <EntityDetailLayout
        breadcrumbs={[
          { label: 'Orders', href: '/orders' },
          { label: `#${order.orderNumber}` },
        ]}
        title={`Order #${order.orderNumber}`}
        subtitle={`Placed on ${formatDate(order.createdTime)}`}
        state={order.stateId}
        allowedActions={data.allowedActionsAndMetadata}
        onAction={(eventId) => mutation.mutate({ id: orderId, eventId })}
        actionLoading={mutation.isPending}
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Items */}
          <Card>
            <CardHeader><CardTitle>Items</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-100">
                    {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full rounded object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-gray-500">Qty: {item.quantity} x {formatPriceRupees(item.unitPrice)}</p>
                  </div>
                  <span className="font-medium">{formatPriceRupees(item.totalPrice)}</span>
                </div>
              ))}
              <Separator />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPriceRupees(order.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{formatPriceRupees(order.shippingCost)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatPriceRupees(order.taxAmount)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPriceRupees(order.discount)}</span></div>}
                <Separator />
                <div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatPriceRupees(order.total)}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card>
            <CardHeader><CardTitle>Shipping Details</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium">{order.shippingAddress?.fullName}</p>
              <p className="text-gray-500">{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p className="text-gray-500">{order.shippingAddress.addressLine2}</p>}
              <p className="text-gray-500">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
              <p className="text-gray-500">{order.shippingAddress?.phone}</p>
              {order.trackingNumber && (
                <p className="mt-4"><span className="text-gray-500">Tracking:</span> {order.trackingNumber}</p>
              )}
              {order.estimatedDelivery && (
                <p className="mt-1"><span className="text-gray-500">Est. delivery:</span> {formatDate(order.estimatedDelivery)}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order status timeline */}
        {order.activities.length > 0 && (
          <Card className="mt-6">
            <CardHeader><CardTitle>Order Timeline</CardTitle></CardHeader>
            <CardContent>
              <OrderStatusTimeline activities={order.activities} />
            </CardContent>
          </Card>
        )}
      </EntityDetailLayout>
    </div>
  );
}
