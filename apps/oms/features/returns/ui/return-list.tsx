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
        { key: 'productName', header: 'Product' },
        { key: 'userId', header: 'Customer' },
        {
          key: 'reason',
          header: 'Reason',
          render: (item) => <span className="max-w-[200px] truncate text-sm">{item.reason || 'N/A'}</span>,
        },
        { key: 'refundAmount', header: 'Refund', type: 'price', align: 'right' },
        { key: 'stateId', header: 'State', type: 'state' },
        { key: 'createdTime', header: 'Date', type: 'date' },
      ]}
    />
  );
}
