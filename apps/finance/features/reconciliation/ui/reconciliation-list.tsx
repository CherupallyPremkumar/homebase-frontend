'use client';

import { EntityList, formatDate, formatNumber } from '@homebase/ui';
import { reconciliationApi } from '@homebase/api-client';

export function ReconciliationList() {
  return (
    <EntityList
      title="Reconciliation"
      queryKey="finance-reconciliation"
      queryFn={reconciliationApi.search}
      display="table"
      searchable
      emptyTitle="No reconciliation batches"
      emptyDescription="Batches will appear here after daily reconciliation runs."
      columns={[
        {
          key: 'batchDate',
          header: 'Date',
          linkTo: (item) => `/reconciliation/${item.id}`,
          render: (item) => <span>{formatDate(item.batchDate)}</span>,
        },
        { key: 'gatewayName', header: 'Gateway' },
        { key: 'totalTransactions', header: 'Total Txns', type: 'number' },
        {
          key: 'matchedCount',
          header: 'Matched',
          render: (item) => <span className="text-green-600">{formatNumber(item.matchedCount)}</span>,
        },
        {
          key: 'mismatchedCount',
          header: 'Mismatches',
          render: (item) => (
            <span className={item.mismatchedCount > 0 ? 'font-medium text-red-600' : ''}>
              {formatNumber(item.mismatchedCount)}
            </span>
          ),
        },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
