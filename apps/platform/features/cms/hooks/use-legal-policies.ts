'use client';

import { useQuery } from '@tanstack/react-query';
import { complianceApi } from '@homebase/api-client';
import type { CompliancePolicy } from '@homebase/api-client';

import type { LegalPolicy } from '../services/legal-policies-mock';

// ----------------------------------------------------------------
// Adapter: CompliancePolicy (API) → LegalPolicy (UI)
// ----------------------------------------------------------------

function toLegalPolicy(policy: CompliancePolicy): LegalPolicy {
  const typeMap: Record<string, LegalPolicy['policyType']> = {
    TERMS: 'terms',
    PRIVACY: 'privacy',
    RETURNS: 'returns',
    SHIPPING: 'shipping',
    SELLER_AGREEMENT: 'seller-agreement',
    COOKIES: 'cookies',
  };
  const statusMap: Record<string, LegalPolicy['status']> = {
    PUBLISHED: 'Published',
    ACTIVE: 'Published',
    DRAFT: 'Draft',
    CREATED: 'Draft',
  };
  return {
    id: policy.id,
    policyType: typeMap[policy.type] ?? 'terms',
    title: policy.name,
    description: (policy.content ?? '').slice(0, 100),
    status: statusMap[policy.status] ?? statusMap[policy.stateId] ?? 'Draft',
    version: policy.version ?? '1.0',
    wordCount: policy.content ? policy.content.split(/\s+/).length : 0,
    lastUpdated: policy.updatedAt ?? policy.effectiveDate ?? '',
    content: policy.content ?? '',
    versionHistory: [
      {
        version: `v${policy.version ?? '1.0'}`,
        date: policy.updatedAt ?? policy.effectiveDate ?? '',
        author: 'System',
      },
    ],
  };
}

// ----------------------------------------------------------------
// Legal Policies Hook
// ----------------------------------------------------------------

/**
 * Fetches legal policy data from the compliance API.
 * Transforms CompliancePolicy responses into the UI LegalPolicy shape.
 */
export function useLegalPolicies() {
  return useQuery<LegalPolicy[]>({
    queryKey: ['legal-policies'],
    queryFn: async () => {
      const response = await complianceApi.searchPolicies({ pageNum: 1, pageSize: 50 });
      return (response.list ?? []).map((r) => toLegalPolicy(r.row));
    },
    staleTime: 30_000,
  });
}
