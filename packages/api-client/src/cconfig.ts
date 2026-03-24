import type { CConfig, CConfigFormSchema } from '@homebase/types';
import { getApiClient } from './client';

export const cconfigApi = {
  getAll() {
    return getApiClient().get<CConfig[]>('/cconfig');
  },
  getByKey(key: string) {
    return getApiClient().get<CConfig>('/cconfig/' + encodeURIComponent(key));
  },
  getValue(key: string) {
    return getApiClient().get<string>('/cconfig/' + encodeURIComponent(key) + '/value');
  },
  update(key: string, value: string) {
    return getApiClient().put<CConfig>('/cconfig/' + encodeURIComponent(key), { value });
  },
  getFormSchema(key: string) {
    return getApiClient().get<CConfigFormSchema>('/cconfig/schema/' + encodeURIComponent(key));
  },
};
