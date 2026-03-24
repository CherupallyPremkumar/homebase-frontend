'use client';

import { EntityList } from '@homebase/ui';
import { supportApi } from '@homebase/api-client';

const PRIORITY_STYLES: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700',
  HIGH: 'bg-orange-100 text-orange-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-gray-100 text-gray-700',
};

export function TicketList() {
  return (
    <EntityList
      title="Support Tickets"
      queryKey="oms-support"
      queryFn={supportApi.search}
      display="table"
      searchable
      searchPlaceholder="Search tickets..."
      emptyTitle="No tickets found"
      columns={[
        { key: 'subject', header: 'Subject', linkTo: (item) => `/support/${item.id}` },
        { key: 'category', header: 'Category' },
        {
          key: 'priority',
          header: 'Priority',
          render: (item) => (
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.LOW}`}>
              {item.priority}
            </span>
          ),
        },
        { key: 'customerId', header: 'Customer' },
        { key: 'createdAt', header: 'Created', type: 'date' },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
