'use client';

import { EntityList } from '@homebase/ui';
import { onboardingApi } from '@homebase/api-client';

export function OnboardingList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Supplier Onboarding</h1>
      <EntityList
        title="Onboarding Applications"
        queryKey="platform-onboarding"
        queryFn={onboardingApi.search}
        display="table"
        searchable
        searchPlaceholder="Search by business name..."
        emptyTitle="No onboarding in progress"
        columns={[
          { key: 'businessName', header: 'Business', linkTo: (item) => `/onboarding/${item.id}` },
          {
            key: 'documentsUploaded',
            header: 'Docs',
            render: (item) => <span>{item.documentsUploaded ? '\u2713' : '\u2014'}</span>,
          },
          {
            key: 'businessVerified',
            header: 'Verified',
            render: (item) => <span>{item.businessVerified ? '\u2713' : '\u2014'}</span>,
          },
          {
            key: 'trainingCompleted',
            header: 'Training',
            render: (item) => <span>{item.trainingCompleted ? '\u2713' : '\u2014'}</span>,
          },
          { key: 'stateId', header: 'Status', type: 'state' },
        ]}
      />
    </div>
  );
}
