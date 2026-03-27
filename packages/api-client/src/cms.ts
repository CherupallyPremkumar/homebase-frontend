import type { SearchRequest, SearchResponse } from '@homebase/types';
import { getApiClient } from './client';

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  stateId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsBanner {
  id: string;
  title: string;
  position: string;
  imageUrl: string;
  linkUrl: string;
  active: boolean;
  startDate: string;
  endDate: string;
  stateId: string;
  createdAt: string;
  updatedAt: string;
}

export const cmsApi = {
  searchPages(params: SearchRequest) {
    return getApiClient().post<SearchResponse<CmsPage>>('/cms/CMS.getPages', params);
  },

  searchBanners(params: SearchRequest) {
    return getApiClient().post<SearchResponse<CmsBanner>>('/cms/CMS.getBanners', params);
  },

  createPage(data: Partial<CmsPage>) {
    return getApiClient().post<CmsPage>('/cms', data);
  },

  updatePage(id: string, data: Partial<CmsPage>) {
    return getApiClient().put<CmsPage>(`/cms/${id}`, data);
  },
};
