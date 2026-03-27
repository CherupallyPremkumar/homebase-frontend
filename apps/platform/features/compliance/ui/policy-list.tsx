'use client';

import { EntityList } from '@homebase/ui';
import { complianceApi } from '@homebase/api-client';

export function PolicyList() {
  return (
    <EntityList
      title="Compliance Policies"
      queryKey="platform-compliance-policies"
      queryFn={complianceApi.searchPolicies}
      display="table"
      searchable
      searchPlaceholder="Search policies..."
      emptyTitle="No policies found"
      emptyDescription="Create compliance policies to manage your platform governance."
      columns={[
        { key: 'name', header: 'Policy Name', linkTo: (item) => `/compliance/${item.id}` },
        { key: 'type', header: 'Type' },
        { key: 'version', header: 'Version' },
        { key: 'stateId', header: 'Status', type: 'state' },
        { key: 'effectiveDate', header: 'Effective Date', type: 'date' },
      ]}
    />
  );
}
