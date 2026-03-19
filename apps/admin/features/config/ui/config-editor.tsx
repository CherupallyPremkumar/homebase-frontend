'use client';

import { SectionSkeleton, ErrorSection } from '@homebase/shared';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@homebase/ui';
import { useState } from 'react';
import { useConfigList, useConfigMutation } from '../api/queries';

function ConfigRow({ configKey, value, description, onSave }: { configKey: string; value: string; description?: string; onSave: (value: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  return (
    <div className="flex items-start gap-4 rounded border p-3">
      <div className="flex-1">
        <p className="text-sm font-medium font-mono">{configKey}</p>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      {editing ? (
        <div className="flex items-center gap-2">
          <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-48 text-sm" />
          <Button size="sm" onClick={() => { onSave(editValue); setEditing(false); }}>Save</Button>
          <Button size="sm" variant="ghost" onClick={() => { setEditValue(value); setEditing(false); }}>Cancel</Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">{value}</span>
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Edit</Button>
        </div>
      )}
    </div>
  );
}

export function ConfigEditor() {
  const { data, isLoading, error, refetch } = useConfigList();
  const updateMutation = useConfigMutation();

  if (isLoading) return <SectionSkeleton rows={10} />;
  if (error) return <ErrorSection error={error} onRetry={() => refetch()} />;

  const grouped = (data || []).reduce<Record<string, typeof data>>((acc, config) => {
    const module = config.module || 'General';
    if (!acc[module]) acc[module] = [];
    acc[module]!.push(config);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Platform Configuration</h1>
      {Object.entries(grouped).map(([module, configs]) => (
        <Card key={module}>
          <CardHeader><CardTitle>{module}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {configs!.map((config) => (
              <ConfigRow key={config.key} configKey={config.key} value={config.value} description={config.description} onSave={(value) => updateMutation.mutate({ key: config.key, value })} />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
