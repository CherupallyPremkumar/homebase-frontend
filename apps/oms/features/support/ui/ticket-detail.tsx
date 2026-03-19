'use client';

import { EntityDetailLayout, SectionSkeleton, ErrorSection, formatDate } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Separator } from '@homebase/ui';
import { User, Headphones } from 'lucide-react';
import { useSupportDetail, useSupportMutation } from '../api/queries';

const PRIORITY_STYLES: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700',
  HIGH: 'bg-orange-100 text-orange-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-gray-100 text-gray-700',
};

interface TicketDetailProps {
  id: string;
}

export function TicketDetail({ id }: TicketDetailProps) {
  const { data, isLoading, error, refetch } = useSupportDetail(id);
  const mutation = useSupportMutation();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const ticket = data.mutatedEntity;

  return (
    <EntityDetailLayout
      breadcrumbs={[{ label: 'Support', href: '/support' }, { label: ticket.subject }]}
      title={ticket.subject}
      subtitle={formatDate(ticket.createdTime)}
      state={ticket.stateId}
      allowedActions={data.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id, eventId })}
      actionLoading={mutation.isPending}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {/* Ticket info */}
        <Card>
          <CardHeader><CardTitle>Ticket Info</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Category</span>
              <span className="font-medium">{ticket.category || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Priority</span>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.LOW}`}>
                {ticket.priority}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Customer</span>
              <span className="font-medium">{ticket.userId || 'N/A'}</span>
            </div>
            {ticket.orderId && (
              <div className="flex justify-between">
                <span className="text-gray-500">Order</span>
                <a href={`/orders/${ticket.orderId}`} className="font-medium text-primary hover:underline">
                  View Order
                </a>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Assigned To</span>
              <span className="font-medium">{ticket.assignedTo || 'Unassigned'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Message thread */}
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Messages</CardTitle></CardHeader>
          <CardContent>
            {ticket.messages?.length ? (
              <div className="space-y-4">
                {ticket.messages.map((msg, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 text-sm">
                      {msg.senderType === 'CUSTOMER' ? (
                        <User className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Headphones className="h-4 w-4 text-primary" />
                      )}
                      <span className="font-medium">{msg.senderId || msg.senderType}</span>
                      <span className="text-xs text-gray-400">{formatDate(msg.createdAt)}</span>
                    </div>
                    <p className="mt-1 ml-6 text-sm text-gray-700">{msg.body}</p>
                    {i < ticket.messages.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No messages yet</p>
            )}
          </CardContent>
        </Card>

        {/* Activity */}
        <Card className="md:col-span-3">
          <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
          <CardContent>
            {ticket.activities?.length ? (
              <div className="flex flex-wrap gap-4">
                {ticket.activities.map((activity, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">{activity.name}</p>
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
      </div>
    </EntityDetailLayout>
  );
}
