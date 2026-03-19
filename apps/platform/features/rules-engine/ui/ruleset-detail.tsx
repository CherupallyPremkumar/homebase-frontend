'use client';

import { EntityDetailLayout, SectionSkeleton, ErrorSection } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@homebase/ui';
import { useRuleSetDetail, useRuleSetMutation, useFactDefinitions } from '../api/queries';
import type { Rule, FactDefinition, ActivityLog } from '@homebase/types';

interface RulesetDetailProps {
  id: string;
}

export function RulesetDetail({ id }: RulesetDetailProps) {
  const { data, isLoading, error, refetch } = useRuleSetDetail(id);
  const { data: factDefinitions } = useFactDefinitions();
  const mutation = useRuleSetMutation();

  if (isLoading) return <SectionSkeleton rows={6} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const ruleset = data.mutatedEntity;

  return (
    <EntityDetailLayout
      breadcrumbs={[
        { label: 'Rules Engine', href: '/settings/rules' },
        { label: ruleset.name },
      ]}
      title={ruleset.name}
      subtitle={`Type: ${ruleset.policyType || 'N/A'} | Priority: ${ruleset.priority ?? 'N/A'}`}
      state={ruleset.stateId}
      allowedActions={data.allowedActionsAndMetadata}
      onAction={(eventId) => mutation.mutate({ id, eventId })}
      actionLoading={mutation.isPending}
    >
      <Tabs defaultValue="rules">
        <TabsList>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="facts">Fact Definitions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="rules" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Rules ({ruleset.rules.length})</CardTitle></CardHeader>
            <CardContent className="p-6">
              {ruleset.rules.length ? (
                <div className="space-y-3">
                  {ruleset.rules.map((rule: Rule, i: number) => (
                    <div key={i} className="rounded border p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{rule.name || `Rule ${i + 1}`}</p>
                        <span className="text-xs text-gray-500">Priority: {rule.priority ?? 'N/A'}</span>
                      </div>
                      {rule.condition && (
                        <p className="mt-1 font-mono text-xs text-gray-600">{rule.condition}</p>
                      )}
                      {rule.action && (
                        <p className="mt-1 text-xs text-gray-500">Action: {rule.action}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No rules defined</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="facts" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {factDefinitions?.length ? (
                <div className="space-y-3">
                  {factDefinitions.map((fact: FactDefinition, i: number) => (
                    <div key={i} className="flex items-center justify-between rounded border p-3 text-sm">
                      <div>
                        <p className="font-medium">{fact.name}</p>
                        <p className="text-xs text-gray-500">{fact.description || 'No description'}</p>
                      </div>
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium">{fact.dataType}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No fact definitions</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {ruleset.activities?.length ? (
                <div className="space-y-3">
                  {ruleset.activities.map((a: ActivityLog, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
                      <div>
                        <p className="font-medium">{a.name}</p>
                        {a.comment && <p className="text-gray-500">{a.comment}</p>}
                        <p className="text-xs text-gray-400">{a.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No activity</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </EntityDetailLayout>
  );
}
