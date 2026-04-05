'use client';

import { useQuery } from '@tanstack/react-query';
import { onboardingApi } from '@homebase/api-client';
import type { SupplierOnboarding, SearchResponse } from '@homebase/types';

import type {
  PipelineCount,
  OnboardingStats,
  OnboardingApplication,
  DocumentChecklistItem,
  ApplicantPreview,
  AutoApprovalRule,
  TrainingSeller,
  SlaTimerEntry,
} from '../types';
import {
  mockPipelineCounts,
  mockOnboardingStats,
  mockApplications,
  mockDocumentChecklist,
  mockApplicantPreview,
  mockAutoApprovalRules,
  mockTrainingSellers,
  mockSlaTimers,
} from '../services/mock-data';

// ----------------------------------------------------------------
// Adapters: transform SearchResponse -> UI-specific types
// ----------------------------------------------------------------

const STAGE_STYLES: Record<string, { color: string; borderColor: string; bgColor: string }> = {
  Applied: { color: 'text-blue-600', borderColor: 'border-blue-200', bgColor: 'bg-blue-100' },
  Documents: { color: 'text-yellow-600', borderColor: 'border-yellow-200', bgColor: 'bg-yellow-100' },
  Verification: { color: 'text-purple-600', borderColor: 'border-purple-200', bgColor: 'bg-purple-100' },
  Training: { color: 'text-orange-600', borderColor: 'border-orange-200', bgColor: 'bg-orange-100' },
  Active: { color: 'text-green-600', borderColor: 'border-green-200', bgColor: 'bg-green-100' },
};

/**
 * Maps backend stateId to a pipeline stage name.
 */
function stateToStage(stateId: string): string {
  const mapping: Record<string, string> = {
    CREATED: 'Applied', APPLIED: 'Applied', PENDING_DOCUMENTS: 'Applied',
    DOCUMENTS_SUBMITTED: 'Documents', DOCUMENT_REVIEW: 'Documents',
    VERIFICATION: 'Verification', UNDER_REVIEW: 'Verification',
    TRAINING: 'Training', TRAINING_IN_PROGRESS: 'Training',
    ACTIVE: 'Active', APPROVED: 'Active', COMPLETED: 'Active',
  };
  return mapping[stateId] ?? 'Applied';
}

/**
 * Adapts onboarding search response into pipeline counts.
 */
function adaptPipelineCounts(response: SearchResponse<SupplierOnboarding>): PipelineCount[] {
  const counts: Record<string, number> = { Applied: 0, Documents: 0, Verification: 0, Training: 0, Active: 0 };

  for (const item of response.list ?? []) {
    const stateId = item.row.stateId ?? (item.row.currentState?.stateId) ?? 'CREATED';
    const stage = stateToStage(stateId);
    counts[stage] = (counts[stage] ?? 0) + 1;
  }

  // Use mock-data shapes for the rich pipeline cards -- backend doesn't
  // supply SLA metrics yet.  Count is the only live value.
  return mockPipelineCounts.map((mock) => ({
    ...mock,
    count: counts[mock.stage] ?? 0,
  }));
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-600',
  'bg-purple-100 text-purple-600',
  'bg-green-100 text-green-600',
  'bg-amber-100 text-amber-600',
  'bg-rose-100 text-rose-600',
  'bg-indigo-100 text-indigo-600',
  'bg-teal-100 text-teal-600',
  'bg-cyan-100 text-cyan-600',
];

/**
 * Adapts onboarding search response into applications table rows.
 */
function adaptApplications(response: SearchResponse<SupplierOnboarding>): OnboardingApplication[] {
  return (response.list ?? []).map((item, idx) => {
    const o = item.row;
    const name = o.businessName ?? '';
    const initials = name.split(' ').map((w: string) => w.charAt(0)).join('').substring(0, 2).toUpperCase();
    const stateId = o.stateId ?? (o.currentState?.stateId) ?? 'CREATED';
    const stage = stateToStage(stateId);
    const docsProgress = o.documentsUploaded ? '6/6' : '0/6';
    const trainingStatus = o.trainingCompleted ? '100%' : stage === 'Training' ? 'In Progress' : '--';

    return {
      id: o.id,
      initials,
      avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length]!,
      sellerName: name,
      businessType: 'Sole Proprietorship' as const,
      appliedDate: o.createdTime ? new Date(o.createdTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      currentStage: stage as OnboardingApplication['currentStage'],
      documentsProgress: docsProgress,
      slaStatus: 'green' as const,
      slaText: '--',
      trainingStatus,
    };
  });
}

// ----------------------------------------------------------------
// Pipeline Counts (5 stages)
// ----------------------------------------------------------------

export function useOnboardingPipeline() {
  return useQuery<PipelineCount[]>({
    queryKey: ['onboarding-pipeline'],
    queryFn: async () => {
      try {
        const response = await onboardingApi.search({
          pageNum: 1,
          pageSize: 200,
        });
        return adaptPipelineCounts(response as unknown as SearchResponse<SupplierOnboarding>);
      } catch {
        return mockPipelineCounts;
      }
    },
    staleTime: 15_000,
  });
}

// ----------------------------------------------------------------
// Onboarding Stats (4 metric cards)
// ----------------------------------------------------------------

export function useOnboardingStats() {
  return useQuery<OnboardingStats>({
    queryKey: ['onboarding-stats'],
    queryFn: async () => {
      // Backend doesn't provide aggregated stats yet; use mock data.
      return mockOnboardingStats;
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Applications Table
// ----------------------------------------------------------------

export function useOnboardingApplications() {
  return useQuery<OnboardingApplication[]>({
    queryKey: ['onboarding-applications'],
    queryFn: async () => {
      try {
        const response = await onboardingApi.search({
          pageNum: 1,
          pageSize: 20,
        });
        return adaptApplications(response as unknown as SearchResponse<SupplierOnboarding>);
      } catch {
        return mockApplications;
      }
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Applicant Preview
// ----------------------------------------------------------------

export function useApplicantPreview() {
  return useQuery<ApplicantPreview>({
    queryKey: ['onboarding-applicant-preview'],
    queryFn: async () => {
      return mockApplicantPreview;
    },
    staleTime: 60_000,
  });
}

// ----------------------------------------------------------------
// Auto-Approval Rules
// ----------------------------------------------------------------

export function useAutoApprovalRules() {
  return useQuery<AutoApprovalRule[]>({
    queryKey: ['onboarding-auto-approval-rules'],
    queryFn: async () => {
      return mockAutoApprovalRules;
    },
    staleTime: 60_000,
  });
}

// ----------------------------------------------------------------
// Training Sellers
// ----------------------------------------------------------------

export function useTrainingSellers() {
  return useQuery<TrainingSeller[]>({
    queryKey: ['onboarding-training-sellers'],
    queryFn: async () => {
      return mockTrainingSellers;
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// SLA Timers
// ----------------------------------------------------------------

export function useSlaTimers() {
  return useQuery<SlaTimerEntry[]>({
    queryKey: ['onboarding-sla-timers'],
    queryFn: async () => {
      return mockSlaTimers;
    },
    staleTime: 15_000,
  });
}

// ----------------------------------------------------------------
// Document Checklist
// ----------------------------------------------------------------

export function useDocumentChecklist() {
  return useQuery<DocumentChecklistItem[]>({
    queryKey: ['onboarding-doc-checklist'],
    queryFn: async () => {
      return mockDocumentChecklist;
    },
    staleTime: 60_000,
  });
}
