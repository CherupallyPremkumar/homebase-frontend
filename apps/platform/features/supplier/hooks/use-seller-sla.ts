'use client';

import { useQuery } from '@tanstack/react-query';

import {
  mockSlaStats,
  mockSellerSlaEntries,
  mockSellersAtRisk,
  mockSlaTrend,
  mockViolationBreakdown,
  mockSlaViolations,
} from '../services/sla-mock';
import type {
  SlaStats,
  SellerSlaEntry,
  SellerAtRisk,
  SlaTrendMonth,
  ViolationBreakdown,
  SlaViolation,
} from '../services/sla-mock';

// ----------------------------------------------------------------
// SLA Stats (4 stat cards)
// ----------------------------------------------------------------

export function useSellerSlaStats() {
  return useQuery<SlaStats>({
    queryKey: ['seller-sla-stats'],
    queryFn: async () => mockSlaStats,
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Seller SLA Entries (rankings table)
// ----------------------------------------------------------------

export function useSellerSla() {
  return useQuery<SellerSlaEntry[]>({
    queryKey: ['seller-sla-entries'],
    queryFn: async () => mockSellerSlaEntries,
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Sellers at Risk
// ----------------------------------------------------------------

export function useSellersAtRisk() {
  return useQuery<SellerAtRisk[]>({
    queryKey: ['sellers-at-risk'],
    queryFn: async () => mockSellersAtRisk,
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// SLA Trend (6 months bar chart)
// ----------------------------------------------------------------

export function useSlaTrend() {
  return useQuery<SlaTrendMonth[]>({
    queryKey: ['sla-trend'],
    queryFn: async () => mockSlaTrend,
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Violation Breakdown
// ----------------------------------------------------------------

export function useViolationBreakdown() {
  return useQuery<ViolationBreakdown[]>({
    queryKey: ['violation-breakdown'],
    queryFn: async () => mockViolationBreakdown,
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Recent SLA Violations
// ----------------------------------------------------------------

export function useSellerSlaViolations() {
  return useQuery<SlaViolation[]>({
    queryKey: ['seller-sla-violations'],
    queryFn: async () => mockSlaViolations,
    staleTime: 30_000,
  });
}
