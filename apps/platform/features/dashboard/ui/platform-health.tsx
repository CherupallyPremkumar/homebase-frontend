'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@homebase/ui';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface HealthIndicator {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
}

const HEALTH_INDICATORS: HealthIndicator[] = [
  { name: 'API Gateway', status: 'healthy' },
  { name: 'Database', status: 'healthy' },
  { name: 'Redis Cache', status: 'healthy' },
  { name: 'Kafka Messaging', status: 'healthy' },
  { name: 'Payment Gateway', status: 'healthy' },
  { name: 'Search Index', status: 'healthy' },
];

const STATUS_CONFIG = {
  healthy: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Healthy' },
  degraded: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Degraded' },
  down: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Down' },
};

export function PlatformHealth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {HEALTH_INDICATORS.map((indicator) => {
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
      </CardContent>
    </Card>
  );
}
