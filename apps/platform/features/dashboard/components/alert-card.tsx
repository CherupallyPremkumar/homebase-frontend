import { cn } from '@homebase/ui/src/lib/utils';
import { AlertTriangle, BarChart3 } from 'lucide-react';

import type { PlatformAlert, AlertAction } from '../types';

interface SeverityStyle {
  border: string;
  bg: string;
  badge: string;
  titleColor: string;
  descColor: string;
  iconColor: string;
  primaryBtn: string;
  secondaryBtn: string;
}

const SEVERITY_CONFIG: Record<string, SeverityStyle> = {
  p0: { border: 'border-red-200', bg: 'bg-red-50/50', badge: 'bg-red-600', titleColor: 'text-red-800', descColor: 'text-red-600', iconColor: 'text-red-600', primaryBtn: 'bg-red-600 hover:bg-red-700 text-white', secondaryBtn: 'bg-red-100 hover:bg-red-200 text-red-700' },
  p1: { border: 'border-amber-200', bg: 'bg-amber-50/50', badge: 'bg-amber-500', titleColor: 'text-amber-800', descColor: 'text-amber-600', iconColor: 'text-amber-600', primaryBtn: 'bg-amber-500 hover:bg-amber-600 text-white', secondaryBtn: 'bg-amber-100 hover:bg-amber-200 text-amber-700' },
  p2: { border: 'border-blue-200', bg: 'bg-blue-50/50', badge: 'bg-blue-500', titleColor: 'text-blue-800', descColor: 'text-blue-600', iconColor: 'text-blue-600', primaryBtn: 'bg-blue-500 hover:bg-blue-600 text-white', secondaryBtn: 'bg-blue-100 hover:bg-blue-200 text-blue-700' },
};

function ActionButton({ action, config }: { action: AlertAction; config: SeverityStyle }) {
  return (
    <button
      className={cn(
        'rounded-lg px-3 py-1.5 text-xs font-medium transition',
        action.variant === 'primary' ? config.primaryBtn : config.secondaryBtn,
      )}
    >
      {action.label}
    </button>
  );
}

interface AlertCardProps {
  alert: PlatformAlert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const config = SEVERITY_CONFIG[alert.severity];
  const Icon = alert.severity === 'p0' ? AlertTriangle : alert.severity === 'p1' ? AlertTriangle : BarChart3;

  return (
    <div className={cn('flex items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-md', config.border, config.bg)}>
      <div className="mt-0.5 shrink-0">
        <span className={cn('inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white', config.badge)}>
          {alert.severity.toUpperCase()}
        </span>
      </div>
      <div className="mt-1 shrink-0">
        <Icon className={cn('h-5 w-5', config.iconColor)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-semibold', config.titleColor)}>{alert.title}</p>
        <p className={cn('mt-0.5 text-xs', config.descColor)}>{alert.description}</p>
        <p className="mt-1 text-[10px] text-gray-400">{alert.timestamp}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {alert.actions.map((action) => (
          <ActionButton key={action.label} action={action} config={config} />
        ))}
      </div>
    </div>
  );
}
