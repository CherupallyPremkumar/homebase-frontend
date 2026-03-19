'use client';

import { EntityList } from '@homebase/ui';
import { ordersApi } from '@homebase/api-client';
import type { Order } from '@homebase/types';

export function OrderList() {
  return (
    <EntityList<Order>
      title="Orders"
      subtitle="Manage order lifecycle"
      queryKey="oms-orders"
      queryFn={ordersApi.search}
      display="table"
      searchable
      searchPlaceholder="Search by order number..."
      columns={[
        {
          key: 'orderNumber',
          header: 'Order',
          linkTo: (item) => `/orders/${item.id}`,
          render: (item) => `#${item.orderNumber}`,
        },
        {
          key: 'userId',
          header: 'Customer',
          render: (item) => item.shippingAddress?.fullName ?? 'N/A',
        },
        {
          key: 'items',
          header: 'Items',
          render: (item) => `${item.items.length} item(s)`,
        },
        { key: 'total', header: 'Total', type: 'price', align: 'right' },
        { key: 'stateId', header: 'Status', type: 'state' },
        { key: 'createdTime', header: 'Date', type: 'date' },
      ]}
      tabs={[
        { label: 'All', filter: {} },
        { label: 'Pending', filter: { stateId: 'CREATED' } },
        { label: 'Processing', filter: { stateId: 'PROCESSING' } },
        { label: 'Shipped', filter: { stateId: 'SHIPPED' } },
        { label: 'Delivered', filter: { stateId: 'DELIVERED' } },
        { label: 'Cancelled', filter: { stateId: 'CANCELLED' } },
      ]}
      emptyTitle="No orders"
      emptyDescription="Orders will appear here when customers place them."
    />
  );
}
