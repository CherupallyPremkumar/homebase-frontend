import type { RuleSet, FactDefinition, Decision, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const rulesEngineApi = {
  searchRuleSets(params: SearchRequest) {
    return getApiClient().post<SearchResponse<RuleSet>>('/api/v1/rules/search', params);
  },
  getRuleSet(id: string) {
    return getApiClient().get<StateEntityServiceResponse<RuleSet>>(`/api/v1/rules/${id}`);
  },
  createRuleSet(ruleSet: Partial<RuleSet>) {
    return getApiClient().post<StateEntityServiceResponse<RuleSet>>('/api/v1/rules', ruleSet);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<RuleSet>>(`/api/v1/rules/${id}/${eventId}`, payload ?? {});
  },
  getFactDefinitions() {
    return getApiClient().get<FactDefinition[]>('/api/v1/rules/facts');
  },
  evaluate(ruleSetId: string, facts: Record<string, unknown>) {
    return getApiClient().post<Decision>(`/api/v1/rules/${ruleSetId}/evaluate`, facts);
  },
};
