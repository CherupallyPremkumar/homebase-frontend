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
          linkTo: (item) => `/finance/reconciliation/${item.id}`,
          render: (item) => <span>{formatDate(item.batchDate)}</span>,
        },
        { key: 'gatewayType', header: 'Gateway' },
        {
          key: 'matchedCount',
          header: 'Matched',
          render: (item) => <span className="text-green-600">{formatNumber(item.matchedCount ?? 0)}</span>,
        },
        {
          key: 'mismatchCount',
          header: 'Mismatches',
          render: (item) => (
            <span className={(item.mismatchCount ?? 0) > 0 ? 'font-medium text-red-600' : ''}>
              {formatNumber(item.mismatchCount ?? 0)}
            </span>
          ),
        },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
