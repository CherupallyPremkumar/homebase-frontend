export type { Payment, PaymentRefund, SearchRequest, SearchResponse, StateEntityServiceResponse } from '@homebase/types';

export interface PaymentWebhookLog {
  id: string;
  paymentId: string;
  eventType: string;
  gatewayResponse: string;
  status: string;
  receivedAt: string;
}
