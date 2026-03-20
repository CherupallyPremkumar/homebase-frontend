'use client';

import { EntityList } from '@homebase/ui';
import { ordersApi } from '@homebase/api-client';

export function SellerOrderList() {
  return (
    <EntityList
      title="Orders"
      subtitle="Orders containing your products"
      queryKey="seller-orders"
      queryFn={ordersApi.search}
      display="table"
      searchable
      searchPlaceholder="Search orders..."
      emptyTitle="No orders yet"
      emptyDescription="Orders will appear here when customers buy your products."
      columns={[
        { key: 'orderNumber', header: 'Order', linkTo: (item) => `/orders/${item.id}`, render: (item) => <span>#{item.orderNumber}</span> },
        { key: 'total', header: 'Amount', type: 'price', align: 'right' },
        { key: 'stateId', header: 'Status', type: 'state' },
        { key: 'createdTime', header: 'Date', type: 'date' },
      ]}
    />
  );
}
