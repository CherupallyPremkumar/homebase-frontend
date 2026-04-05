import type { ReactNode } from 'react';

// ----------------------------------------------------------------
// Slot-Based Layout Composition
// ----------------------------------------------------------------

export interface DashboardLayoutProps {
  /** Page header with title and date range filter */
  header: ReactNode;
  /** Stat cards row */
  stats: ReactNode;
  /** Revenue chart (full width) */
  chart: ReactNode;
  /** Left column content (e.g. activity feed) */
  left: ReactNode;
  /** Right column content (e.g. top sellers) */
  right: ReactNode;
  /** Footer section (e.g. platform health) */
  footer: ReactNode;
}

/**
 * DashboardLayout provides a slot-based composition shell.
 * Each slot is an independent ReactNode -- Suspense boundaries,
 * error boundaries, and loading states are owned by the caller
 * (the orchestrator page), not by this layout.
 *
 * Responsive breakpoints:
 *   - xs/sm: single column, full-stack
 *   - xl+: two-column middle section (left/right)
 */
export function DashboardLayout({
  header,
  stats,
  chart,
  left,
  right,
  footer,
}: DashboardLayoutProps) {
  return (
    <div className="space-y-8">
      {/* Row 1: Header */}
      {header}

      {/* Row 2: Stat Cards */}
      {stats}

      {/* Row 3: Chart (full width) */}
      {chart}

      {/* Row 4: Two-column split */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {left}
        {right}
      </div>

      {/* Row 5: Footer */}
      {footer}
    </div>
  );
}
