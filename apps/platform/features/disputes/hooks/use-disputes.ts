'use client';

import { useQuery } from '@tanstack/react-query';
import { supportApi } from '@homebase/api-client';
import type { SupportTicket } from '@homebase/types';

import type { DisputeListResponse, DisputeStats, Dispute, DisputeIssueType, DisputeStatus } from '../types';

/* ------------------------------------------------------------------ */
/*  Adapter: SupportTicket (API) -> Dispute / DisputeStats (UI)        */
/*                                                                      */
/*  Disputes are modeled as support tickets with category = 'DISPUTE'   */
/*  on the backend. The UI presents them in a dispute-specific view.    */
/* ------------------------------------------------------------------ */

function toDispute(ticket: SupportTicket): Dispute {
  const statusMap: Record<string, DisputeStatus> = {
    CREATED: 'Open',
    OPEN: 'Open',
    IN_PROGRESS: 'Under Review',
    ESCALATED: 'Escalated',
    RESOLVED: 'Resolved',
  };
  return {
    id: ticket.id,
    orderId: ticket.orderId ?? '',
    customer: ticket.userId,
    seller: '',
    issueType: (ticket.category ?? 'Quality') as DisputeIssueType,
    amount: '-',
    status: statusMap[ticket.stateId] ?? 'Open',
    opened: ticket.createdTime ?? '',
  };
}

function computeStats(disputes: Dispute[]): DisputeStats {
  return {
    open: disputes.filter((d) => d.status === 'Open').length,
    underReview: disputes.filter((d) => d.status === 'Under Review').length,
    escalated: disputes.filter((d) => d.status === 'Escalated').length,
    resolved: disputes.filter((d) => d.status === 'Resolved').length,
  };
}

/* ------------------------------------------------------------------ */
/*  Dispute Stats                                                      */
/* ------------------------------------------------------------------ */

export function useDisputeStats() {
  return useQuery<DisputeStats>({
    queryKey: ['dispute-stats'],
    queryFn: async () => {
      const response = await supportApi.search({
        pageNum: 1,
        pageSize: 200,
        filters: { category: 'DISPUTE' },
      });
      const disputes = (response.list ?? []).map((r) => toDispute(r.row));
      return computeStats(disputes);
    },
    staleTime: 30_000,
  });
}

/* ------------------------------------------------------------------ */
/*  Dispute List (filtered)                                            */
/* ------------------------------------------------------------------ */

interface DisputeListFilters {
  tab?: string;
  search?: string;
}

export function useDisputeList(filters: DisputeListFilters = {}) {
  return useQuery<DisputeListResponse>({
    queryKey: ['disputes', filters],
    queryFn: async () => {
      const apiFilters: Record<string, string> = { category: 'DISPUTE' };
      if (filters.tab && filters.tab !== 'All') {
        const tabMap: Record<string, string> = {
          Open: 'OPEN',
          'Under Review': 'IN_PROGRESS',
          Escalated: 'ESCALATED',
          Resolved: 'RESOLVED',
        };
        const stateId = tabMap[filters.tab];
        if (stateId) apiFilters.stateId = stateId;
      }
      if (filters.search) {
        apiFilters.search = filters.search;
      }

      const response = await supportApi.search({
        pageNum: 1,
        pageSize: 50,
        filters: apiFilters,
      });
      const disputes = (response.list ?? []).map((r) => toDispute(r.row));
      return {
        disputes,
        stats: computeStats(disputes),
      };
    },
    staleTime: 30_000,
  });
}
