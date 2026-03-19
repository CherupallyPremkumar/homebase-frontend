'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@homebase/api-client';
import { useStmMutation, EntityDetailLayout, SectionSkeleton, ErrorSection, formatPriceRupees, formatDate, CACHE_TIMES } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Separator } from '@homebase/ui';
import type { Order } from '@homebase/types';

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => ordersApi.getById(id),
    ...CACHE_TIMES.orderDetail,
  });

  const mutation = useStmMutation<Order>({
    entityType: 'admin-order',
    mutationFn: ordersApi.processEvent,
  });

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
        <Card>
          <CardHeader><CardTitle>Items</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium">{formatPriceRupees(item.totalPrice)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold"><span>Total</span><span>{formatPriceRupees(order.total)}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Shipping</CardTitle></CardHeader>
          <CardContent className="text-sm">
            {order.shippingAddress ? (
              <>
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-gray-500">{order.shippingAddress.addressLine1}</p>
                <p className="text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                <p className="text-gray-500">{order.shippingAddress.phone}</p>
              </>
            ) : (
              <p className="text-gray-500">No shipping address</p>
            )}
          </CardContent>
        </Card>
      </div>
    </EntityDetailLayout>
  );
}
