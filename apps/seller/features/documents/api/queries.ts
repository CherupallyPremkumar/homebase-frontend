'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import type { SearchResponse } from '@homebase/types';

export interface SellerDocument {
  id: string;
  type: 'GSTIN_CERTIFICATE' | 'PAN_CARD' | 'BUSINESS_REGISTRATION' | 'BANK_PROOF' | 'ADDRESS_PROOF';
  fileName: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploadedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export function useSellerDocuments() {
  return useQuery({
    queryKey: ['seller-documents'],
    queryFn: () => getApiClient().post<SearchResponse<SellerDocument>>('/onboarding/sellerDocuments', {
      pageNum: 1,
      pageSize: 50,
    }),
    select: (data) => data.list?.map(r => r.row) ?? [],
    staleTime: 120_000,
  });
}
