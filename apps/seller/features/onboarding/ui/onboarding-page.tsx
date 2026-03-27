'use client';

import { useQuery } from '@tanstack/react-query';
import { suppliersApi, getApiClient } from '@homebase/api-client';
import { SectionSkeleton, ErrorSection, StateBadge, StmActionBar } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { Check, FileText, Building2, GraduationCap } from 'lucide-react';
import { cn } from '@homebase/ui/src/lib/utils';
import { useOnboardingMutation } from '../api/queries';
import type { SearchResponse } from '@homebase/types';

const STEPS = [
  { key: 'documentsUploaded', label: 'Upload Documents', description: 'Business registration, GSTIN, PAN, bank details', icon: FileText },
  { key: 'businessVerified', label: 'Business Verification', description: 'Our team verifies your documents (1-2 business days)', icon: Building2 },
  { key: 'trainingCompleted', label: 'Complete Training', description: 'Learn how to list products, manage orders, and grow', icon: GraduationCap },
];

export function OnboardingPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['seller-onboarding-detail'],
    queryFn: async () => {
      const statusResponse = await getApiClient().post<SearchResponse<{ id: string }>>('/onboarding/myOnboarding', {
        pageNum: 1,
        pageSize: 1,
      });
      const id = statusResponse.list?.[0]?.row?.id ?? statusResponse.data?.row?.id;
      if (!id) throw new Error('No onboarding found');
      return suppliersApi.retrieveOnboarding(id);
    },
    staleTime: 30_000,
  });

  const mutation = useOnboardingMutation();

  if (isLoading) return <SectionSkeleton rows={4} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const onboarding = data.mutatedEntity;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Seller Onboarding</h1>
        <p className="mt-1 text-sm text-gray-500">Complete these steps to start selling on HomeBase</p>
        <div className="mt-2">
          <StateBadge state={onboarding.stateId} />
        </div>
      </div>

      {/* Checklist */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {STEPS.map((step, i) => {
              const completed = onboarding[step.key as keyof typeof onboarding] === true;
              const Icon = step.icon;

              return (
                <div key={step.key} className="flex items-start gap-4">
                  <div className={cn(
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
                    completed ? 'bg-green-100' : 'bg-gray-100',
                  )}>
                    {completed ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Icon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={cn('font-medium', completed ? 'text-green-700' : 'text-gray-900')}>
                      {step.label}
                    </p>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                  {completed && <span className="text-sm font-medium text-green-600">Done</span>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions from backend */}
      {data.allowedActionsAndMetadata.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Next Steps</CardTitle></CardHeader>
          <CardContent>
            <StmActionBar
              allowedActions={data.allowedActionsAndMetadata}
              onAction={(eventId) => mutation.mutate({ id: onboarding.id, eventId })}
              loading={mutation.isPending}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
