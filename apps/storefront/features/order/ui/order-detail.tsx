'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@homebase/api-client';
import { useStmMutation, CACHE_TIMES } from '@homebase/shared';
import { EntityDetail, InfoGrid, ActivityTimeline, formatPrice, formatDate } from '@homebase/ui';
import type { Order } from '@homebase/types';

export function OrderDetail({ orderId }: { orderId: string }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => ordersApi.retrieve(orderId),
    ...CACHE_TIMES.orderDetail,
  });

  const mutation = useStmMutation<Order>({
    entityType: 'orders',
    mutationFn: ordersApi.processById,
  });

  const order = data?.mutatedEntity;

  return (
    <div className="container mx-auto px-4 py-6">
      <EntityDetail
        breadcrumbs={[
          { label: 'Orders', href: '/orders' },
          { label: order ? `#${order.orderNumber}` : '...' },
        ]}
        title={order ? `Order #${order.orderNumber}` : 'Order'}
        subtitle={order?.createdTime ? `Placed ${formatDate(order.createdTime)}` : undefined}
        state={order?.stateId}
        allowedActions={data?.allowedActionsAndMetadata}
        onAction={(eventId) => mutation.mutate({ id: orderId, eventId })}
        actionLoading={mutation.isPending}
        loading={isLoading}
        error={error ? 'Failed to load order' : null}
        onRetry={() => refetch()}
        tabs={order ? [
          {
            key: 'items',
            label: 'Items',
            badge: order.items.length,
            content: (
              <div className="rounded-md border border-gray-200 bg-white">
                <div className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3">
                      <div className="h-14 w-14 flex-shrink-0 rounded bg-gray-50">
                        {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full rounded object-contain" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} x {formatPrice(item.unitPrice)}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 p-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{formatPrice(order.shippingCost)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatPrice(order.taxAmount)}</span></div>
                  {order.discount > 0 && <div className="flex justify-between text-success-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
                  <div className="flex justify-between border-t border-gray-100 pt-1 text-base font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                </div>
              </div>
            ),
          },
          {
            key: 'shipping',
            label: 'Shipping',
            content: order.shippingAddress ? (
              <div className="rounded-md border border-gray-200 bg-white p-4">
                <InfoGrid fields={[
                  { label: 'Name', value: order.shippingAddress.fullName },
                  { label: 'Phone', value: order.shippingAddress.phone },
                  { label: 'Address', value: `${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''}`, span: 2 },
                  { label: 'City', value: order.shippingAddress.city },
                  { label: 'State', value: order.shippingAddress.state },
                  { label: 'Pincode', value: order.shippingAddress.pincode },
                  { label: 'Tracking', value: order.trackingNumber },
                  { label: 'Est. Delivery', value: order.estimatedDelivery, type: 'date' },
                ]} />
              </div>
            ) : <p className="text-sm text-gray-400">No shipping info</p>,
          },
          {
            key: 'activity',
            label: 'Activity',
            badge: order.activities?.length,
            content: (
              <div className="rounded-md border border-gray-200 bg-white p-4">
                <ActivityTimeline activities={order.activities || []} />
              </div>
            ),
          },
        ] : [{ key: 'loading', label: '', content: null }]}
      />
    </div>
  );
}
