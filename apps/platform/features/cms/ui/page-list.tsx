'use client';

import { EntityList } from '@homebase/ui';
import { cmsApi } from '@homebase/api-client';

export function PageList() {
  return (
    <EntityList
      title="CMS Pages"
      queryKey="platform-cms-pages"
      queryFn={cmsApi.searchPages}
      display="table"
      searchable
      searchPlaceholder="Search pages..."
      createAction={{ label: 'New Page', href: '/cms/new' }}
      emptyTitle="No pages found"
      emptyDescription="Create your first CMS page to get started."
      columns={[
        { key: 'title', header: 'Title', linkTo: (item) => `/cms/${item.id}` },
        { key: 'slug', header: 'Slug' },
        { key: 'stateId', header: 'Status', type: 'state' },
        { key: 'updatedAt', header: 'Last Modified', type: 'date' },
      ]}
    />
  );
}
