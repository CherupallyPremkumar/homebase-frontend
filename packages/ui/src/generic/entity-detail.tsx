'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  MoreVertical,
  AlertTriangle,
  Pencil,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import {
  categorizeActions,
  formatEventLabel,
  type CategorizedActions,
} from '../lib/action-utils';
import { StateBadge } from '../display/state-badge';
import { Button } from '../button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../dropdown-menu';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../alert-dialog';
import type { AllowedAction } from '@homebase/types';

// --- Sub-types ---

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TabConfig {
  key: string;
  label: string;
  content: React.ReactNode;
  badge?: number;
}

// --- Props ---

export interface EntityDetailProps {
  // Header
  breadcrumbs: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  state?: string;

  // STM Actions (from backend)
  allowedActions?: AllowedAction[];
  onAction?: (eventId: string, payload?: unknown) => void;
  actionLoading?: boolean;
  dangerousEvents?: string[];  // override defaults

  // Content tabs
  tabs: TabConfig[];
  defaultTab?: string;

  // Sidebar (optional right column)
  sidebar?: React.ReactNode;

  // Loading/error
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;

  // Escape hatch
  headerExtra?: React.ReactNode;
  children?: React.ReactNode;
}

export function EntityDetail({
  breadcrumbs,
  title,
  subtitle,
  state,
  allowedActions,
  onAction,
  actionLoading = false,
  dangerousEvents,
  tabs,
  defaultTab,
  sidebar,
  loading = false,
  error,
  onRetry,
  headerExtra,
  children,
}: EntityDetailProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key || '');
  const [confirmAction, setConfirmAction] = useState<AllowedAction | null>(null);

  const overrideDangerousSet = useMemo(
    () => (dangerousEvents ? new Set(dangerousEvents) : undefined),
    [dangerousEvents],
  );

  const categorized: CategorizedActions = useMemo(() => {
    if (!allowedActions?.length) {
      return { primary: [], secondary: [], dangerous: [], edit: [] };
    }
    return categorizeActions(allowedActions, overrideDangerousSet);
  }, [allowedActions, overrideDangerousSet]);

  const hasDropdownItems =
    categorized.secondary.length > 0 ||
    categorized.dangerous.length > 0 ||
    categorized.edit.length > 0;

  // --- Loading skeleton ---
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-3 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
        </div>
        {/* Header skeleton */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-7 w-56 animate-pulse rounded bg-gray-100" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
            </div>
            <div className="h-4 w-36 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-24 animate-pulse rounded-md bg-gray-100" />
            <div className="h-9 w-9 animate-pulse rounded-md bg-gray-100" />
          </div>
        </div>
        {/* Tab bar skeleton */}
        <div className="flex gap-4 border-b border-gray-200 pb-px">
          <div className="h-5 w-16 animate-pulse rounded bg-gray-100" />
          <div className="h-5 w-16 animate-pulse rounded bg-gray-100" />
          <div className="h-5 w-16 animate-pulse rounded bg-gray-100" />
        </div>
        {/* Content skeleton */}
        <div className={cn(sidebar ? 'grid gap-6 lg:grid-cols-3' : '')}>
          <div className={cn(sidebar ? 'lg:col-span-2' : '', 'space-y-3')}>
            <div className="h-48 w-full animate-pulse rounded-lg border border-gray-100 bg-gray-50" />
            <div className="h-32 w-full animate-pulse rounded-lg border border-gray-100 bg-gray-50" />
          </div>
          {sidebar && (
            <div className="space-y-3">
              <div className="h-24 w-full animate-pulse rounded-lg border border-gray-100 bg-gray-50" />
              <div className="h-32 w-full animate-pulse rounded-lg border border-gray-100 bg-gray-50" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-8 py-16">
        <div className="mb-3 rounded-full bg-red-100 p-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <p className="text-sm font-medium text-red-800">{error}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-4 border-red-300 text-red-700 hover:bg-red-50">
            Try again
          </Button>
        )}
      </div>
    );
  }

  function handleAction(eventId: string) {
    onAction?.(eventId);
  }

  function handleDangerousAction(action: AllowedAction) {
    setConfirmAction(action);
  }

  return (
    <div className="space-y-6">
      {/* === Breadcrumbs === */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-gray-500 transition-colors hover:text-gray-900"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-gray-900">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* === Header: title + state + actions === */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: title, state, subtitle */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="truncate text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            {state && <StateBadge state={state} />}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
          {headerExtra}
        </div>

        {/* Right: action buttons */}
        {onAction && (
          <div className="flex flex-shrink-0 items-center gap-2">
            {/* Primary action buttons — visible and prominent */}
            {categorized.primary.map((action) => (
              <Button
                key={action.allowedAction}
                onClick={() => handleAction(action.allowedAction)}
                disabled={actionLoading}
                size="sm"
              >
                {actionLoading && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {formatEventLabel(action.allowedAction)}
              </Button>
            ))}

            {/* Kebab / More Actions dropdown — edit, secondary, dangerous */}
            {hasDropdownItems && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    disabled={actionLoading}
                    aria-label="More actions"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {/* Edit actions */}
                  {categorized.edit.length > 0 && (
                    <>
                      {categorized.edit.map((action) => (
                        <DropdownMenuItem
                          key={action.allowedAction}
                          onClick={() => handleAction(action.allowedAction)}
                          disabled={actionLoading}
                        >
                          <Pencil className="mr-2 h-4 w-4 text-gray-500" />
                          {formatEventLabel(action.allowedAction)}
                        </DropdownMenuItem>
                      ))}
                      {(categorized.secondary.length > 0 || categorized.dangerous.length > 0) && (
                        <DropdownMenuSeparator />
                      )}
                    </>
                  )}

                  {/* Secondary actions */}
                  {categorized.secondary.length > 0 && (
                    <>
                      {categorized.secondary.map((action) => (
                        <DropdownMenuItem
                          key={action.allowedAction}
                          onClick={() => handleAction(action.allowedAction)}
                          disabled={actionLoading}
                        >
                          {formatEventLabel(action.allowedAction)}
                        </DropdownMenuItem>
                      ))}
                      {categorized.dangerous.length > 0 && (
                        <DropdownMenuSeparator />
                      )}
                    </>
                  )}

                  {/* Dangerous actions — red text, requires confirmation */}
                  {categorized.dangerous.length > 0 && (
                    <>
                      <DropdownMenuLabel className="text-xs font-normal text-gray-400">
                        Destructive
                      </DropdownMenuLabel>
                      {categorized.dangerous.map((action) => (
                        <DropdownMenuItem
                          key={action.allowedAction}
                          onClick={() => handleDangerousAction(action)}
                          disabled={actionLoading}
                          className="text-red-600 focus:bg-red-50 focus:text-red-700"
                        >
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          {formatEventLabel(action.allowedAction)}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {/* === Confirmation Dialog for Dangerous Actions === */}
      <AlertDialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction
                ? `Confirm: ${formatEventLabel(confirmAction.allowedAction)}`
                : ''}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action may not be reversible. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmAction) {
                  handleAction(confirmAction.allowedAction);
                }
                setConfirmAction(null);
              }}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {confirmAction
                ? formatEventLabel(confirmAction.allowedAction)
                : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* === Content: Tabs + optional sidebar === */}
      <div className={cn(sidebar ? 'grid gap-6 lg:grid-cols-3' : '')}>
        <div className={cn(sidebar ? 'lg:col-span-2' : '')}>
          {/* Tab bar */}
          {tabs.length > 1 && (
            <div
              className="mb-4 flex gap-1 border-b border-gray-200"
              role="tablist"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors',
                    activeTab === tab.key
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700',
                  )}
                >
                  {tab.label}
                  {tab.badge != null && tab.badge > 0 && (
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-xs font-medium',
                        activeTab === tab.key
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-500',
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Tab content */}
          {tabs.map((tab) => (
            <div key={tab.key} role="tabpanel" hidden={activeTab !== tab.key}>
              {activeTab === tab.key && tab.content}
            </div>
          ))}

          {/* Escape hatch children */}
          {children}
        </div>

        {/* Sidebar */}
        {sidebar && <aside className="space-y-4">{sidebar}</aside>}
      </div>
    </div>
  );
}
