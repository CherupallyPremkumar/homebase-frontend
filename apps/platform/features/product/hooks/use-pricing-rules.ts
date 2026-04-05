'use client';

import { useQuery } from '@tanstack/react-query';

import {
  mockPricingRuleStats,
  mockPricingRules,
  mockPriceChangeLog,
  mockRuleConflict,
} from '../services/pricing-rules-mock';
import type {
  PricingRule,
  PricingRuleStats,
  PricingRuleType,
  PriceChangeLogEntry,
  RuleConflict,
} from '../services/pricing-rules-mock';

// ----------------------------------------------------------------
// Pricing Rule Stats (4 stat cards)
// ----------------------------------------------------------------

export function usePricingRuleStats() {
  return useQuery<PricingRuleStats>({
    queryKey: ['pricing-rule-stats'],
    queryFn: async () => mockPricingRuleStats,
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Pricing Rules List
// ----------------------------------------------------------------

export function usePricingRules(typeFilter: string) {
  return useQuery<PricingRule[]>({
    queryKey: ['pricing-rules', typeFilter],
    queryFn: async () => {
      if (typeFilter === 'All') return mockPricingRules;
      return mockPricingRules.filter((rule) => rule.type === (typeFilter as PricingRuleType));
    },
    staleTime: 15_000,
  });
}

// ----------------------------------------------------------------
// Rule Conflict
// ----------------------------------------------------------------

export function useRuleConflict() {
  return useQuery<RuleConflict>({
    queryKey: ['rule-conflict'],
    queryFn: async () => mockRuleConflict,
    staleTime: 60_000,
  });
}

// ----------------------------------------------------------------
// Price Change Log
// ----------------------------------------------------------------

export function usePriceChangeLog() {
  return useQuery<PriceChangeLogEntry[]>({
    queryKey: ['price-change-log'],
    queryFn: async () => mockPriceChangeLog,
    staleTime: 60_000,
  });
}
