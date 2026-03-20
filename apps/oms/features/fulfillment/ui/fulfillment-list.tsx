'use client';

import { EntityList } from '@homebase/ui';
import { fulfillmentApi } from '@homebase/api-client';

export function FulfillmentList() {
  return (
    <EntityList
      title="Fulfillment"
      queryKey="oms-fulfillment"
      queryFn={fulfillmentApi.search}
      display="table"
      searchable
      searchPlaceholder="Search fulfillment orders..."
      emptyTitle="No fulfillment orders"
      columns={[
        {
          key: 'orderId',
          header: 'Order',
          linkTo: (item) => `/fulfillment/${item.id}`,
          render: (item) => <span>{item.orderId?.slice(0, 8)}...</span>,
        },
        { key: 'warehouseId', header: 'Warehouse' },
        {
          key: 'lineItems',
          header: 'Items',
          render: (item) => <span>{item.lineItems?.length || 0} item(s)</span>,
        },
        { key: 'carrier', header: 'Carrier' },
        { key: 'stateId', header: 'State', type: 'state' },
      ]}
    />
  );
}
