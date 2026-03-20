'use client';

import { EntityDetail, InfoGrid, ActivityTimeline, formatPrice, formatDate } from '@homebase/ui';
import { useOrderDetail, useOrderMutation } from '../api/queries';

interface OmsOrderDetailProps {
  id: string;
}

export function OrderDetail({ id }: OmsOrderDetailProps) {
  const { data, isLoading, error, refetch } = useOrderDetail(id);
  const mutation = useOrderMutation();

  const order = data?.mutatedEntity;

  return (
    <EntityDetail
      breadcrumbs={[
        { label: 'Orders', href: '/orders' },
        { label: order ? `#${order.orderNumber}` : '...' },
      ]}
      title={order ? `Order #${order.orderNumber}` : 'Order'}
      subtitle={order ? formatDate(order.createdTime) : undefined}
      state={order?.stateId}
      allowedActions={data?.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id, eventId })}
      actionLoading={mutation.isPending}
      loading={isLoading}
      error={error ? 'Failed to load order' : null}
      onRetry={() => refetch()}
      sidebar={order ? (
        <div className="space-y-4">
          <div className="rounded-md border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium uppercase text-gray-400">Order Total</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{formatPrice(order.total)}</p>
          </div>
          {order.shippingAddress && (
            <div className="rounded-md border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium uppercase text-gray-400 mb-2">Ship To</p>
              <p className="text-sm font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-gray-500">{order.shippingAddress.addressLine1}</p>
              <p className="text-sm text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
            </div>
          )}
        </div>
      ) : undefined}
      tabs={order ? [
        {
          key: 'items',
          label: 'Items',
          badge: order.items.length,
          content: (
            <div className="rounded-md border border-gray-200 bg-white">
              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 text-sm">
                    <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-50">
                      {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full rounded object-contain" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-gray-500">SKU: {item.sku} | Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          key: 'details',
          label: 'Details',
          content: (
            <div className="rounded-md border border-gray-200 bg-white p-4">
              <InfoGrid fields={[
                { label: 'Order Number', value: order.orderNumber },
                { label: 'Customer', value: order.userId },
                { label: 'Payment Method', value: order.paymentMethod },
                { label: 'Payment ID', value: order.paymentId },
                { label: 'Subtotal', value: order.subtotal, type: 'price' },
                { label: 'Shipping', value: order.shippingCost, type: 'price' },
                { label: 'Tax', value: order.taxAmount, type: 'price' },
                { label: 'Discount', value: order.discount, type: 'price' },
                { label: 'Total', value: order.total, type: 'price' },
                { label: 'Tracking Number', value: order.trackingNumber },
                { label: 'Est. Delivery', value: order.estimatedDelivery, type: 'date' },
                { label: 'Delivered At', value: order.deliveredAt, type: 'date' },
              ]} columns={3} />
            </div>
          ),
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
  );
}
