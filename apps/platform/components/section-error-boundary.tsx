'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

// ----------------------------------------------------------------
// Props & State
// ----------------------------------------------------------------

interface SectionErrorBoundaryProps {
  /** The section name shown in the error UI */
  section: string;
  /** Content to render when no error has occurred */
  children: ReactNode;
  /** Optional custom fallback; receives section name and retry fn */
  fallback?: (props: { section: string; retry: () => void }) => ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In production, send to error reporting service
    console.error(`[SectionErrorBoundary:${this.props.section}]`, error, info);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback({
          section: this.props.section,
          retry: this.handleRetry,
        });
      }

      // Default error UI
      return (
        <div
          className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle
            className="h-8 w-8 text-red-400 mb-3"
            aria-hidden="true"
          />
          <h3 className="text-sm font-semibold text-gray-900">
            {this.props.section} failed to load
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            This section encountered an error. Other sections are unaffected.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition"
          >
            <RefreshCw className="h-3 w-3" aria-hidden="true" />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
