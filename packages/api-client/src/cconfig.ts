import type { CConfig, CConfigFormSchema } from '@homebase/types';
import { getApiClient } from './client';

export const cconfigApi = {
  getAll() {
    return getApiClient().get<CConfig[]>('/api/v1/cconfig');
  },
  getByKey(key: string) {
    return getApiClient().get<CConfig>(`/api/v1/cconfig/${encodeURIComponent(key)}`);
  },
  getValue(key: string) {
    return getApiClient().get<string>(`/api/v1/cconfig/${encodeURIComponent(key)}/value`);
  },
  update(key: string, value: string) {
    return getApiClient().put<CConfig>(`/api/v1/cconfig/${encodeURIComponent(key)}`, { value });
  },
  getFormSchema(key: string) {
    return getApiClient().get<CConfigFormSchema>(`/api/v1/cconfig/schema/${encodeURIComponent(key)}`);
  },
};
