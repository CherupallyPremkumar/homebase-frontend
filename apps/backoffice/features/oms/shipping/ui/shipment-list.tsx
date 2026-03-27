'use client';

import { EntityList } from '@homebase/ui';
import { shippingApi } from '@homebase/api-client';

export function ShipmentList() {
  return (
    <EntityList
      title="Shipments"
      queryKey="oms-shipments"
      queryFn={shippingApi.search}
      display="table"
      searchable
      searchPlaceholder="Search by tracking #..."
      emptyTitle="No shipments found"
      columns={[
        {
          key: 'trackingNumber',
          header: 'Tracking #',
          linkTo: (item) => `/oms/shipments/${item.id}`,
          render: (item) => <span>{item.trackingNumber || 'Pending'}</span>,
        },
        {
          key: 'orderId',
          header: 'Order',
          linkTo: (item) => `/oms/orders/${item.orderId}`,
          render: (item) => <span>{item.orderId?.slice(0, 8)}...</span>,
        },
        { key: 'carrier', header: 'Carrier' },
        { key: 'shippingMethod', header: 'Method' },
        { key: 'stateId', header: 'State', type: 'state' },
        { key: 'createdAt', header: 'Created', type: 'date' },
      ]}
    />
  );
}
