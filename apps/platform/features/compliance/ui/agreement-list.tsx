'use client';

import { EntityList } from '@homebase/ui';
import { complianceApi } from '@homebase/api-client';

export function AgreementList() {
  return (
    <EntityList
      title="Agreements"
      queryKey="platform-compliance-agreements"
      queryFn={complianceApi.searchAgreements}
      display="table"
      searchable
      searchPlaceholder="Search agreements..."
      emptyTitle="No agreements found"
      emptyDescription="Agreements will appear here once policies are accepted by parties."
      columns={[
        { key: 'name', header: 'Agreement', linkTo: (item) => `/compliance/agreements/${item.id}` },
        { key: 'effectiveDate', header: 'Effective Date', type: 'date' },
        {
          key: 'parties',
          header: 'Parties',
          render: (item) => <span>{item.parties?.join(', ') ?? '\u2014'}</span>,
        },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
