'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiClient } from '@homebase/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

type HealthStatus = 'healthy' | 'degraded' | 'down';

interface HealthIndicator {
  name: string;
  status: HealthStatus;
}

interface ActuatorHealth {
  status: string;
  components?: Record<string, { status: string; details?: Record<string, unknown> }>;
}

const STATUS_CONFIG = {
  healthy: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Healthy' },
  degraded: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Degraded' },
  down: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Down' },
};

/** Map Spring Boot Actuator status strings to our UI statuses */
function mapStatus(actuatorStatus: string): HealthStatus {
  switch (actuatorStatus?.toUpperCase()) {
    case 'UP':
      return 'healthy';
    case 'DOWN':
    case 'OUT_OF_SERVICE':
      return 'down';
    default:
      return 'degraded';
  }
}

/** Friendly display names for common actuator component keys */
const COMPONENT_LABELS: Record<string, string> = {
  db: 'Database',
  redis: 'Redis Cache',
  kafka: 'Kafka Messaging',
  diskSpace: 'Disk Space',
  ping: 'API Gateway',
  mail: 'Mail Service',
  elasticsearch: 'Search Index',
};

function parseHealthResponse(data: ActuatorHealth): HealthIndicator[] {
  if (!data.components) {
    return [{ name: 'Platform', status: mapStatus(data.status) }];
  }

  return Object.entries(data.components).map(([key, component]) => ({
    name: COMPONENT_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1),
    status: mapStatus(component.status),
  }));
}

export function PlatformHealth() {
  const { data: indicators, isLoading, error } = useQuery({
    queryKey: ['platform-health'],
    queryFn: async () => {
      const client = getApiClient();
      const response = await client.get<ActuatorHealth>('/actuator/health');
      return parseHealthResponse(response);
    },
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Health</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 rounded bg-red-50 p-3 text-sm text-red-700">
            <XCircle className="h-4 w-4" />
            <span>Unable to fetch health status</span>
          </div>
        ) : (
          <div className="space-y-3">
            {indicators?.map((indicator) => {
              const config = STATUS_CONFIG[indicator.status];
              const Icon = config.icon;
              return (
                <div key={indicator.name} className="flex items-center justify-between rounded p-2 text-sm">
                  <span className="font-medium">{indicator.name}</span>
                  <span className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${config.color} ${config.bg}`}>
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
