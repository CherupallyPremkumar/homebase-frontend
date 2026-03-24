'use client';

import { EntityList } from '@homebase/ui';
import { suppliersApi } from '@homebase/api-client';

export function SupplierList() {
  return (
    <EntityList
      title="Suppliers"
      queryKey="platform-suppliers"
      queryFn={suppliersApi.search}
      display="table"
      searchable
      searchPlaceholder="Search suppliers..."
      emptyTitle="No suppliers found"
      columns={[
        { key: 'businessName', header: 'Business', linkTo: (item) => `/suppliers/${item.id}` },
        { key: 'businessType', header: 'Type' },
        { key: 'contactEmail', header: 'Email' },
        {
          key: 'rating',
          header: 'Rating',
          render: (item) => <span>{item.rating ? `${Number(item.rating).toFixed(1)} / 5` : 'N/A'}</span>,
        },
        { key: 'totalOrders', header: 'Orders', type: 'number' },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
