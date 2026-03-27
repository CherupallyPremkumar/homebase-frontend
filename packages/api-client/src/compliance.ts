import type { SearchRequest, SearchResponse } from '@homebase/types';
import { getApiClient } from './client';

export interface CompliancePolicy {
  id: string;
  name: string;
  type: string;
  version: string;
  status: string;
  stateId: string;
  content: string;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceAgreement {
  id: string;
  name: string;
  effectiveDate: string;
  parties: string[];
  status: string;
  stateId: string;
  policyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceAcceptance {
  id: string;
  agreementId: string;
  userId: string;
  acceptedAt: string;
  ipAddress: string;
}

export const complianceApi = {
  searchPolicies(params: SearchRequest) {
    return getApiClient().post<SearchResponse<CompliancePolicy>>('/compliance/Compliance.getPolicies', params);
  },

  searchAgreements(params: SearchRequest) {
    return getApiClient().post<SearchResponse<ComplianceAgreement>>('/compliance/Compliance.getAgreements', params);
  },

  getAcceptances(params: SearchRequest) {
    return getApiClient().post<SearchResponse<ComplianceAcceptance>>('/compliance/Compliance.getAcceptances', params);
  },
};
