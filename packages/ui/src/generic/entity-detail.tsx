'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '../lib/utils';
import { StateBadge } from '../display/state-badge';

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

interface AllowedAction {
  eventId: string;
  metadata: Record<string, string>;
  bodyType?: string;
}

// Dangerous events that require confirmation
const DANGEROUS_EVENTS = new Set([
  'CANCEL', 'DELETE', 'REJECT', 'SUSPEND', 'DEACTIVATE',
  'DEPRECATE', 'BLOCK', 'TERMINATE', 'CLOSE', 'DISCARD',
]);

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

  const isDangerous = useMemo(() => {
    const set = dangerousEvents ? new Set(dangerousEvents) : DANGEROUS_EVENTS;
    return (eventId: string) => set.has(eventId);
  }, [dangerousEvents]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded bg-gray-100" />
        <div className="h-8 w-72 animate-pulse rounded bg-gray-100" />
        <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-64 w-full animate-pulse rounded-md bg-gray-50" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8">
        <p className="text-sm font-medium text-red-700">{error}</p>
        {onRetry && (
          <button onClick={onRetry} className="mt-3 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-gray-300" aria-hidden="true">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="text-gray-500 hover:text-primary-600">{crumb.label}</Link>
              ) : (
                <span className="font-medium text-gray-900">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Header: title + state + actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            {state && <StateBadge state={state} />}
          </div>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          {headerExtra}
        </div>

        {/* STM Action Buttons */}
        {allowedActions && allowedActions.length > 0 && onAction && (
          <div className="flex flex-wrap gap-2">
            {allowedActions.map((action) => {
              const dangerous = isDangerous(action.eventId);
              return (
                <button
                  key={action.eventId}
                  onClick={() => {
                    if (dangerous) {
                      setConfirmAction(action);
                    } else {
                      onAction(action.eventId);
                    }
                  }}
                  disabled={actionLoading}
                  className={cn(
                    'inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    dangerous
                      ? 'border border-red-200 bg-white text-red-600 hover:bg-red-50'
                      : 'bg-primary-600 text-white hover:bg-primary-700',
                    actionLoading && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  {actionLoading && (
                    <span className="mr-1.5 h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  {action.eventId.replace(/_/g, ' ')}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setConfirmAction(null)}>
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm {confirmAction.eventId.replace(/_/g, ' ')}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure? This action may not be reversible.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onAction?.(confirmAction.eventId);
                  setConfirmAction(null);
                }}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                {confirmAction.eventId.replace(/_/g, ' ')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content: Tabs + optional sidebar */}
      <div className={cn(sidebar ? 'grid gap-6 lg:grid-cols-3' : '')}>
        <div className={cn(sidebar ? 'lg:col-span-2' : '')}>
          {/* Tab bar */}
          {tabs.length > 1 && (
            <div className="mb-4 flex gap-1 border-b border-gray-200" role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors',
                    activeTab === tab.key
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700',
                  )}
                >
                  {tab.label}
                  {tab.badge != null && (
                    <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">{tab.badge}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Tab content */}
          {tabs.map((tab) => (
            <div
              key={tab.key}
              role="tabpanel"
              hidden={activeTab !== tab.key}
            >
              {activeTab === tab.key && tab.content}
            </div>
          ))}

          {/* Escape hatch children */}
          {children}
        </div>

        {/* Sidebar */}
        {sidebar && (
          <aside className="space-y-4">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
