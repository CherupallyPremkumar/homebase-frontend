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
          linkTo: (item) => `/oms/fulfillment/${item.id}`,
          render: (item) => <span>{item.orderId?.slice(0, 8)}...</span>,
        },
        { key: 'warehouseId', header: 'Warehouse' },
        { key: 'priority', header: 'Priority' },
        { key: 'carrier', header: 'Carrier' },
        { key: 'trackingNumber', header: 'Tracking #' },
        { key: 'stateId', header: 'State', type: 'state' },
      ]}
    />
  );
}
