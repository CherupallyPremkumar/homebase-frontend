'use client';

import { EntityList } from '@homebase/ui';
import { usersApi } from '@homebase/api-client';

export function UserList() {
  return (
    <EntityList
      title="Users"
      queryKey="platform-users"
      queryFn={usersApi.search}
      display="table"
      searchable
      searchPlaceholder="Search users..."
      emptyTitle="No users found"
      columns={[
        {
          key: 'firstName',
          header: 'Name',
          linkTo: (item) => `/users/${item.id}`,
          render: (item) => <span>{item.firstName} {item.lastName}</span>,
        },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        { key: 'role', header: 'Role' },
        { key: 'stateId', header: 'Status', type: 'state' },
      ]}
    />
  );
}
