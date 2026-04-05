'use client';

import { useQuery } from '@tanstack/react-query';

import type {
  ShippingStatCard,
  CarrierLiveStatus,
  CarrierRow,
  ZoneRow,
  SlaRuleRow,
  SlaConfigItem,
  CarrierPerformanceItem,
  RateResult,
  ServiceabilityResult,
} from '../types';

import {
  mockStats,
  mockCarrierLiveStatus,
  mockCarriers,
  mockZones,
  mockSlaRules,
  mockSlaConfig,
  mockCarrierPerformance,
  mockRateResults,
  mockServiceabilityResult,
} from '../services/mock-data';

// ----------------------------------------------------------------
// All hooks return mock data directly. When the real API is wired,
// swap the queryFn internals -- component code stays unchanged.
// ----------------------------------------------------------------

export function useShippingStats() {
  return useQuery<ShippingStatCard[]>({
    queryKey: ['shipping-stats'],
    queryFn: () => Promise.resolve(mockStats),
    staleTime: 60_000,
  });
}

export function useCarrierLiveStatus() {
  return useQuery<CarrierLiveStatus[]>({
    queryKey: ['shipping-carrier-live'],
    queryFn: () => Promise.resolve(mockCarrierLiveStatus),
    staleTime: 30_000,
  });
}

export function useShippingCarriers() {
  return useQuery<CarrierRow[]>({
    queryKey: ['shipping-carriers'],
    queryFn: () => Promise.resolve(mockCarriers),
    staleTime: 60_000,
  });
}

export function useShippingZones() {
  return useQuery<ZoneRow[]>({
    queryKey: ['shipping-zones'],
    queryFn: () => Promise.resolve(mockZones),
    staleTime: 60_000,
  });
}

export function useSlaRules() {
  return useQuery<SlaRuleRow[]>({
    queryKey: ['shipping-sla-rules'],
    queryFn: () => Promise.resolve(mockSlaRules),
    staleTime: 60_000,
  });
}

export function useSlaConfig() {
  return useQuery<SlaConfigItem[]>({
    queryKey: ['shipping-sla-config'],
    queryFn: () => Promise.resolve(mockSlaConfig),
    staleTime: 60_000,
  });
}

export function useCarrierPerformance() {
  return useQuery<CarrierPerformanceItem[]>({
    queryKey: ['shipping-carrier-performance'],
    queryFn: () => Promise.resolve(mockCarrierPerformance),
    staleTime: 60_000,
  });
}

export function useRateCalculator() {
  return useQuery<RateResult[]>({
    queryKey: ['shipping-rate-calculator'],
    queryFn: () => Promise.resolve(mockRateResults),
    staleTime: 60_000,
  });
}

export function useServiceabilityCheck() {
  return useQuery<ServiceabilityResult>({
    queryKey: ['shipping-serviceability'],
    queryFn: () => Promise.resolve(mockServiceabilityResult),
    staleTime: 60_000,
  });
}
