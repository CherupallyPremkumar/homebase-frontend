'use client';

import { EntityList, formatPrice, formatDate } from '@homebase/ui';
import { ordersApi } from '@homebase/api-client';

export function OrderList() {
  return (
    <div className="container mx-auto px-4 py-6">
      <EntityList
        title="My Orders"
        queryKey="my-orders"
        queryFn={ordersApi.myOrders}
        display="cards"
        pageSize={10}
        emptyTitle="No orders yet"
        emptyDescription="Start shopping to see your orders here."
        cardConfig={{
          variant: 'horizontal',
          map: (order) => ({
            title: `Order #${order.orderNumber}`,
            subtitle: formatDate(order.createdTime),
            href: `/orders/${order.id}`,
            state: order.stateId,
            fields: [
              { type: 'text', value: `${order.items?.length || 0} item(s)` },
              { type: 'price', value: order.total },
            ],
          }),
          gridCols: 'grid-cols-1',
        }}
      />
    </div>
  );
}
