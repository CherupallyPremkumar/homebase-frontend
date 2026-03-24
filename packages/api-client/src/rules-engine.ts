import type { RuleSet, FactDefinition, Decision, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const rulesEngineApi = {
  // Query endpoints
  searchRuleSets(params: SearchRequest) {
    return getApiClient().post<SearchResponse<RuleSet>>('/rules-engine/ruleSets', params);
  },
  factDefinitions(params?: SearchRequest) {
    return getApiClient().post<SearchResponse<FactDefinition>>('/rules-engine/factDefinitions', params ?? {
      pageNum: 1,
      pageSize: 100,
    });
  },

  // Query-based retrieve (works with query-build)
  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<RuleSet>>('/rules-engine/ruleSets', {
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('RuleSet not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<RuleSet>;
  },
  create(entity: Partial<RuleSet>) {
    return getApiClient().post<StateEntityServiceResponse<RuleSet>>('/rules-engine', entity);
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<RuleSet>>('/rules-engine/' + id + '/' + eventId, payload ?? {});
  },
  evaluate(ruleSetId: string, facts: Record<string, unknown>) {
    return getApiClient().post<Decision>('/rules-engine/' + ruleSetId + '/evaluate', facts);
  },
};
