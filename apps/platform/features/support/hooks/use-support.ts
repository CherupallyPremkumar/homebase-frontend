'use client';

import { useQuery } from '@tanstack/react-query';
import { supportApi } from '@homebase/api-client';
import type { SupportTicket as SharedTicket, SearchResponse } from '@homebase/types';

import type {
  SupportStats,
  SupportListResponse,
  KnowledgeBaseArticle,
  SupportListFilters,
} from '../types';
import { mockKnowledgeBase } from '../services/mock-data';

export type { SupportListFilters } from '../types';

// ----------------------------------------------------------------
// Adapters: transform SearchResponse → UI-specific types
// ----------------------------------------------------------------

/**
 * Adapts supportTicketStateCounts query response into SupportStats.
 * The backend returns rows with { stateId, count } pairs.
 */
function adaptSupportStats(response: SearchResponse<Record<string, unknown>>): SupportStats {
  const stateCounts: Record<string, number> = {};
  for (const item of response.list ?? []) {
    const stateId = String(item.row.stateId ?? item.row.state_id ?? '');
    const count = Number(item.row.count ?? item.row.cnt ?? 0);
    stateCounts[stateId] = count;
  }

  return {
    open: stateCounts['OPEN'] ?? stateCounts['CREATED'] ?? 0,
    escalated: stateCounts['ESCALATED'] ?? 0,
    avgResponseHrs: 0,
    slaBreach: 0,
  };
}

/**
 * Adapts support ticket search response into SupportListResponse.
 */
function adaptSupportList(response: SearchResponse<SharedTicket>, filters: SupportListFilters): SupportListResponse {
  const tickets = (response.list ?? []).map((item) => {
    const t = item.row;
    const stateId = t.stateId ?? (t.currentState?.stateId) ?? 'CREATED';
    const statusMap: Record<string, string> = {
      CREATED: 'Open', OPEN: 'Open', ASSIGNED: 'Open',
      ESCALATED: 'Escalated', RESOLVED: 'Resolved', CLOSED: 'Closed',
    };
    const priorityMap: Record<string, string> = {
      HIGH: 'High', URGENT: 'High', MEDIUM: 'Medium', LOW: 'Low',
    };

    return {
      id: t.id ?? '',
      customerName: t.userId ?? '',
      type: 'Customer' as const,
      subject: t.subject ?? '',
      priority: (priorityMap[t.priority] ?? 'Medium') as 'High' | 'Medium' | 'Low',
      status: (statusMap[stateId] ?? 'Open') as 'Open' | 'Escalated' | 'Resolved' | 'Closed',
      assignedTo: t.assignedTo ?? '',
      date: t.createdTime ? new Date(t.createdTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
    };
  });

  return {
    tickets,
    total: response.maxRows ?? tickets.length,
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages: response.maxPages ?? 1,
  };
}

// ----------------------------------------------------------------
// Support Stats
// ----------------------------------------------------------------

export function useSupportStats() {
  return useQuery<SupportStats>({
    queryKey: ['support-stats'],
    queryFn: async () => {
      const response = await supportApi.search({
        queryName: 'supportTicketStateCounts',
        pageNum: 1,
        pageSize: 100,
      });
      return adaptSupportStats(response as unknown as SearchResponse<Record<string, unknown>>);
    },
    staleTime: 30_000,
  });
}

// ----------------------------------------------------------------
// Ticket List
// ----------------------------------------------------------------

export function useSupportList(filters: SupportListFilters) {
  return useQuery<SupportListResponse>({
    queryKey: ['support-list', filters],
    queryFn: async () => {
      const searchFilters: Record<string, unknown> = {};
      if (filters.tab && filters.tab !== 'all') searchFilters.stateId = filters.tab.toUpperCase();
      if (filters.search) searchFilters.subject = filters.search;

      const response = await supportApi.search({
        pageNum: filters.page,
        pageSize: filters.pageSize,
        filters: searchFilters,
      });
      return adaptSupportList(response, filters);
    },
    staleTime: 15_000,
  });
}

// ----------------------------------------------------------------
// Knowledge Base Articles
// ----------------------------------------------------------------

export function useKnowledgeBase() {
  return useQuery<KnowledgeBaseArticle[]>({
    queryKey: ['knowledge-base'],
    queryFn: async () => {
      // Knowledge base articles have no backend query endpoint yet;
      // keep the static data until a CMS-backed endpoint is available.
      return mockKnowledgeBase;
    },
    staleTime: 60_000,
  });
}
