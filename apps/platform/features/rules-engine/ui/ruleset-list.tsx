'use client';

import { EntityList } from '@homebase/ui';
import { rulesEngineApi } from '@homebase/api-client';

export function RulesetList() {
  return (
    <EntityList
      title="Rules Engine"
      queryKey="platform-rules"
      queryFn={rulesEngineApi.searchRuleSets}
      display="table"
      searchable
      searchPlaceholder="Search rule sets..."
      emptyTitle="No rule sets"
      columns={[
        { key: 'name', header: 'Name', linkTo: (item) => `/settings/rules/${item.id}` },
        { key: 'policyType', header: 'Type' },
        { key: 'priority', header: 'Priority' },
        {
          key: 'rules',
          header: 'Rules',
          render: (item) => <span>{item.rules?.length || 0} rule(s)</span>,
        },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
