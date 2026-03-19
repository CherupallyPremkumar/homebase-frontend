import type { AllowedAction } from '@homebase/types';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@homebase/ui';
import { StateBadge } from './state-badge';
import { StmActionBar } from './stm-action-bar';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface EntityDetailLayoutProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  state?: string;
  allowedActions?: AllowedAction[];
  onAction?: (eventId: string, payload?: unknown) => void;
  actionLoading?: boolean;
  children: React.ReactNode;
}

export function EntityDetailLayout({
  breadcrumbs,
  title,
  subtitle,
  state,
  allowedActions,
  onAction,
  actionLoading,
  children,
}: EntityDetailLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, i) => (
              <BreadcrumbItem key={i}>
                {i > 0 && <BreadcrumbSeparator />}
                {crumb.href ? (
                  <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {state && <StateBadge state={state} />}
            </div>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>

          {allowedActions && onAction && (
            <StmActionBar
              allowedActions={allowedActions}
              onAction={onAction}
              loading={actionLoading}
            />
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
