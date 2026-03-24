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
          key: 'supplierId',
          header: 'Supplier',
          linkTo: (item) => `/settlements/${item.id}`,
          render: (item) => <span>{item.supplierId ?? 'N/A'}</span>,
        },
        {
          key: 'settlementPeriodStart',
          header: 'Period',
          render: (item) => <span>{formatDate(item.settlementPeriodStart)} -- {formatDate(item.settlementPeriodEnd)}</span>,
        },
        { key: 'orderAmount', header: 'Order Amount', type: 'price' },
        { key: 'commissionAmount', header: 'Commission', type: 'price' },
        {
          key: 'netAmount',
          header: 'Net Payout',
          render: (item) => <span className="font-semibold">{formatPrice(item.netAmount ?? 0)}</span>,
        },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
