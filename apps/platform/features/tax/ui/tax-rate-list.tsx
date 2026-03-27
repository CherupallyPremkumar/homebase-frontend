'use client';

import { EntityList } from '@homebase/ui';
import { taxApi } from '@homebase/api-client';

export function TaxRateList() {
  return (
    <EntityList
      title="Tax Rates"
      queryKey="platform-tax-rates"
      queryFn={taxApi.searchTaxRates}
      display="table"
      searchable
      searchPlaceholder="Search tax rates..."
      emptyTitle="No tax rates configured"
      emptyDescription="Add tax rates to apply taxes on orders."
      columns={[
        { key: 'name', header: 'Name', linkTo: (item) => `/tax/${item.id}` },
        {
          key: 'rate',
          header: 'Rate',
          render: (item) => <span>{item.rate}%</span>,
        },
        { key: 'type', header: 'Type' },
        { key: 'region', header: 'Region' },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
