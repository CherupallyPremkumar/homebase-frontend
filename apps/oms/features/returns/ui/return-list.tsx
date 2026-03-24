'use client';

import { EntityList } from '@homebase/ui';
import { returnRequestsApi } from '@homebase/api-client';

export function ReturnList() {
  return (
    <EntityList
      title="Return Requests"
      queryKey="oms-returns"
      queryFn={returnRequestsApi.search}
      display="table"
      searchable
      searchPlaceholder="Search returns..."
      emptyTitle="No return requests"
      columns={[
        {
          key: 'id',
          header: 'Return #',
          linkTo: (item) => `/returns/${item.id}`,
          render: (item) => <span>{item.id?.slice(0, 8)}...</span>,
        },
        {
          key: 'orderId',
          header: 'Order',
          render: (item) => <span>{item.orderId?.slice(0, 8) ?? 'N/A'}...</span>,
        },
        { key: 'customerId', header: 'Customer' },
        {
          key: 'reason',
          header: 'Reason',
          render: (item) => <span className="max-w-[200px] truncate text-sm">{item.reason || 'N/A'}</span>,
        },
        { key: 'totalRefundAmount', header: 'Refund', type: 'price', align: 'right' },
        { key: 'currentState', header: 'State', type: 'state' },
        { key: 'createdDate', header: 'Date', type: 'date' },
      ]}
    />
  );
}
