'use client';

import { EntityList, formatDate, formatPrice } from '@homebase/ui';
import { settlementsApi } from '@homebase/api-client';

export function SettlementList() {
  return (
    <EntityList
      title="Settlements"
      queryKey="finance-settlements"
      queryFn={settlementsApi.search}
      display="table"
      searchable
      emptyTitle="No settlements"
      emptyDescription="Settlements will appear here once orders are completed and payouts are calculated."
      columns={[
        {
          key: 'supplierName',
          header: 'Supplier',
          linkTo: (item) => `/settlements/${item.id}`,
          render: (item) => <span>{item.supplierName || item.supplierId}</span>,
        },
        {
          key: 'periodStart',
          header: 'Period',
          render: (item) => <span>{formatDate(item.periodStart)} -- {formatDate(item.periodEnd)}</span>,
        },
        { key: 'grossAmount', header: 'Gross', type: 'price' },
        { key: 'commission', header: 'Commission', type: 'price' },
        {
          key: 'netPayout',
          header: 'Net Payout',
          render: (item) => <span className="font-semibold">{formatPrice(item.netPayout)}</span>,
        },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
