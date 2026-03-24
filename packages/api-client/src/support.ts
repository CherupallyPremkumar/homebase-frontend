import type { SupportTicket, TicketMessage, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const supportApi = {
  // Query endpoints
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<SupportTicket>>('/support/tickets', params);
  },
  myTickets(params: SearchRequest) {
    return getApiClient().post<SearchResponse<SupportTicket>>('/support/myTickets', params);
  },

  // Query-based retrieve (works with query-build)
  async retrieve(id: string) {
    const response = await getApiClient().post<SearchResponse<SupportTicket>>('/support/supportTicket', {
      pageNum: 1,
      pageSize: 1,
      filters: { id },
    });
    const item = response.list?.[0];
    if (!item) throw new Error('Support ticket not found');
    return { mutatedEntity: item.row, allowedActionsAndMetadata: item.allowedActions ?? [] } as StateEntityServiceResponse<SupportTicket>;
  },
  create(entity: Partial<SupportTicket>) {
    return getApiClient().post<StateEntityServiceResponse<SupportTicket>>('/support', entity);
  },
  processById(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<SupportTicket>>('/support/' + id + '/' + eventId, payload ?? {});
  },
  addMessage(ticketId: string, message: Partial<TicketMessage>) {
    return getApiClient().post<TicketMessage>('/support/' + ticketId + '/messages', message);
  },
};
