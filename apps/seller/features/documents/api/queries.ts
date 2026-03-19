'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';

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
    queryFn: () => getApiClient().get<SellerDocument[]>('/api/v1/seller/documents'),
    staleTime: 120_000,
  });
}
