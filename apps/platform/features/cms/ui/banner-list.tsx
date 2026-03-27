'use client';

import { EntityList } from '@homebase/ui';
import { cmsApi } from '@homebase/api-client';

export function BannerList() {
  return (
    <EntityList
      title="Banners"
      queryKey="platform-cms-banners"
      queryFn={cmsApi.searchBanners}
      display="table"
      searchable
      searchPlaceholder="Search banners..."
      createAction={{ label: 'New Banner', href: '/cms/banners/new' }}
      emptyTitle="No banners found"
      emptyDescription="Create your first banner to display on the storefront."
      columns={[
        { key: 'title', header: 'Title', linkTo: (item) => `/cms/banners/${item.id}` },
        { key: 'position', header: 'Position' },
        {
          key: 'active',
          header: 'Active',
          render: (item) => (
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {item.active ? 'Active' : 'Inactive'}
            </span>
          ),
        },
        { key: 'startDate', header: 'Start Date', type: 'date' },
        { key: 'endDate', header: 'End Date', type: 'date' },
      ]}
    />
  );
}
