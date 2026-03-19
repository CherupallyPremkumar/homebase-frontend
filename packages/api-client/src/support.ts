import type { SupportTicket, TicketMessage, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';
import { getApiClient } from './client';

export const supportApi = {
  search(params: SearchRequest) {
    return getApiClient().post<SearchResponse<SupportTicket>>('/api/v1/support/search', params);
  },
  getById(id: string) {
    return getApiClient().get<StateEntityServiceResponse<SupportTicket>>(`/api/v1/support/${id}`);
  },
  create(ticket: Partial<SupportTicket>) {
    return getApiClient().post<StateEntityServiceResponse<SupportTicket>>('/api/v1/support', ticket);
  },
  processEvent(id: string, eventId: string, payload?: unknown) {
    return getApiClient().patch<StateEntityServiceResponse<SupportTicket>>(`/api/v1/support/${id}/${eventId}`, payload ?? {});
  },
  addMessage(ticketId: string, message: Partial<TicketMessage>) {
    return getApiClient().post<TicketMessage>(`/api/v1/support/${ticketId}/messages`, message);
  },
  myTickets(params: SearchRequest) {
    return getApiClient().post<SearchResponse<SupportTicket>>('/api/v1/support/my-tickets', params);
  },
};
