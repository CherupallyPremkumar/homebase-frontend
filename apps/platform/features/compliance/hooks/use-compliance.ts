'use client';

import { useQuery } from '@tanstack/react-query';

import type {
  ComplianceStats,
  SellerCompliance,
  DocumentQueueItem,
} from '../types';
import {
  mockComplianceStats,
  mockSellerCompliance,
  mockDocumentQueue,
} from '../services/mock-data';

// ----------------------------------------------------------------
// Compliance Stats (4 stat cards)
// ----------------------------------------------------------------

export function useComplianceStats() {
  return useQuery<ComplianceStats>({
    queryKey: ['compliance-stats'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      return mockComplianceStats;
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Seller Compliance Table
// ----------------------------------------------------------------

export function useSellerCompliance() {
  return useQuery<SellerCompliance[]>({
    queryKey: ['seller-compliance'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return mockSellerCompliance;
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Document Review Queue
// ----------------------------------------------------------------

export function useDocumentQueue() {
  return useQuery<DocumentQueueItem[]>({
    queryKey: ['document-queue'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 350));
      return mockDocumentQueue;
    },
    staleTime: 15_000,
  });
}
