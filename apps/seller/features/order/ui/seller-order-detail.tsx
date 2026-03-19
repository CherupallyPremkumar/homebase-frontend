'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@homebase/api-client';
import { EntityDetailLayout, SectionSkeleton, ErrorSection, formatPriceRupees, formatDate, CACHE_TIMES } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Separator } from '@homebase/ui';

interface SellerOrderDetailProps {
  orderId: string;
}

export function SellerOrderDetail({ orderId }: SellerOrderDetailProps) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['seller-orders', orderId],
    queryFn: () => ordersApi.getById(orderId),
    ...CACHE_TIMES.orderDetail,
  });

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const order = data.mutatedEntity;

  return (
    <EntityDetailLayout
      breadcrumbs={[
        { label: 'Orders', href: '/orders' },
        { label: `#${order.orderNumber}` },
      ]}
      title={`Order #${order.orderNumber}`}
      subtitle={`Placed ${formatDate(order.createdTime)}`}
      state={order.stateId}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-100">
                  {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full rounded object-cover" />}
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-gray-500">Qty: {item.quantity} × {formatPriceRupees(item.unitPrice)}</p>
                </div>
                <span className="text-sm font-medium">{formatPriceRupees(item.totalPrice)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-sm font-bold">
              <span>Total</span>
              <span>{formatPriceRupees(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Shipping Details</CardTitle></CardHeader>
          <CardContent className="text-sm">
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
          </CardContent>
        </Card>
      </div>
    </EntityDetailLayout>
  );
}
