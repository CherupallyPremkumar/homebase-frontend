'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@homebase/api-client';
import { EntityDetail, Separator, formatPrice, formatDate } from '@homebase/ui';
import { CACHE_TIMES } from '@homebase/shared';

interface SellerOrderDetailProps {
  orderId: string;
}

export function SellerOrderDetail({ orderId }: SellerOrderDetailProps) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['seller-orders', orderId],
    queryFn: () => ordersApi.getById(orderId),
    ...CACHE_TIMES.orderDetail,
  });

  const order = data?.mutatedEntity;

  return (
    <EntityDetail
      breadcrumbs={[
        { label: 'Orders', href: '/orders' },
        { label: order ? `#${order.orderNumber}` : 'Loading...' },
      ]}
      title={order ? `Order #${order.orderNumber}` : ''}
      subtitle={order ? `Placed ${formatDate(order.createdTime)}` : undefined}
      state={order?.stateId}
      loading={isLoading}
      error={error ? 'Failed to load order' : null}
      onRetry={() => refetch()}
      tabs={[
        {
          key: 'items',
          label: 'Order Items',
          content: order ? (
            <div className="rounded-md border p-6 space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-100">
                    {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full rounded object-cover" />}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-gray-500">Qty: {item.quantity} x {formatPrice(item.unitPrice)}</p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm font-bold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          ) : null,
        },
        {
          key: 'shipping',
          label: 'Shipping',
          content: order ? (
            <div className="rounded-md border p-6 text-sm">
              {order.shippingAddress ? (
                <>
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p className="text-gray-500">{order.shippingAddress.addressLine1}</p>
                  <p className="text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                </>
              ) : (
                <p className="text-gray-500">Address not available</p>
              )}
              {order.trackingNumber && (
                <div className="mt-4">
                  <p className="text-gray-500">Tracking: <span className="font-mono font-medium text-gray-900">{order.trackingNumber}</span></p>
                </div>
              )}
              {order.estimatedDelivery && (
                <p className="mt-1 text-gray-500">Est. delivery: {formatDate(order.estimatedDelivery)}</p>
              )}
            </div>
          ) : null,
        },
      ]}
    />
  );
}
