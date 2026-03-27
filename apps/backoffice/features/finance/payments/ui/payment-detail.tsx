'use client';

import { EntityDetailLayout, SectionSkeleton, ErrorSection, formatPriceRupees, formatDate } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@homebase/ui';
import { usePaymentDetail, usePaymentRefunds, usePaymentWebhookLog, usePaymentMutation } from '../api/queries';

interface PaymentDetailProps {
  id: string;
}

export function PaymentDetail({ id }: PaymentDetailProps) {
  const { data, isLoading, error, refetch } = usePaymentDetail(id);
  const { data: refunds, isLoading: refundsLoading } = usePaymentRefunds(id);
  const { data: webhooks, isLoading: webhooksLoading } = usePaymentWebhookLog(id);
  const mutation = usePaymentMutation();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const payment = data.mutatedEntity;

  return (
    <EntityDetailLayout
      breadcrumbs={[
        { label: 'Payments', href: '/finance/payments' },
        { label: `Payment ${payment.id.slice(0, 8)}...` },
      ]}
      title={`Payment: ${formatPriceRupees(payment.amount)}`}
      subtitle={`Order: ${payment.orderId} | ${formatDate(payment.createdTime)}`}
      state={payment.stateId}
      allowedActions={data.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id, eventId })}
      actionLoading={mutation.isPending}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Payment Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-lg">{formatPriceRupees(payment.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Currency</span>
              <span className="font-medium">{payment.currency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Method</span>
              <span className="font-medium">{payment.paymentMethod?.replace(/_/g, ' ') || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Gateway</span>
              <span className="font-medium">{payment.gatewayName || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Gateway Txn ID</span>
              <span className="font-mono text-xs">{payment.gatewayTransactionId || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono text-xs">{payment.orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">User ID</span>
              <span className="font-mono text-xs">{payment.userId}</span>
            </div>
            {payment.refundAmount != null && payment.refundAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Refund Amount</span>
                <span className="font-medium text-red-600">{formatPriceRupees(payment.refundAmount)}</span>
              </div>
            )}
            {payment.refundReason && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Refund Reason</span>
                <span className="font-medium">{payment.refundReason}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
          <CardContent>
            {payment.activities?.length ? (
              <div className="space-y-3">
                {payment.activities.map((activity, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      {activity.comment && <p className="text-gray-500">{activity.comment}</p>}
                      <p className="text-xs text-gray-400">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No activity recorded</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Refund History</CardTitle></CardHeader>
          <CardContent>
            {refundsLoading ? (
              <SectionSkeleton rows={2} variant="list" />
            ) : refunds?.length ? (
              <div className="space-y-3">
                {refunds.map((refund) => (
                  <div key={refund.id} className="flex items-start justify-between rounded border p-3 text-sm">
                    <div>
                      <p className="font-medium">{refund.reason}</p>
                      <p className="text-xs text-gray-500">{formatDate(refund.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">{formatPriceRupees(refund.amount)}</p>
                      <Badge variant="outline" className="mt-1">
                        {refund.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No refunds</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Webhook Log</CardTitle></CardHeader>
          <CardContent>
            {webhooksLoading ? (
              <SectionSkeleton rows={2} variant="list" />
            ) : webhooks?.length ? (
              <div className="space-y-3">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="rounded border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{webhook.eventType}</Badge>
                      <span className={`text-xs font-medium ${webhook.status === 'PROCESSED' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {webhook.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{formatDate(webhook.receivedAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No webhook events</p>
            )}
          </CardContent>
        </Card>
      </div>
    </EntityDetailLayout>
  );
}
