'use client';

import { useState } from 'react';
import { AlertTriangle, Eye, X } from 'lucide-react';

import type { LowStockAlert } from '../types';

const TEXT = {
  viewLowStock: 'View Low Stock',
  dismiss: 'Dismiss',
} as const;

interface ProductListAlertBarProps {
  alert: LowStockAlert;
}

export function ProductListAlertBar({ alert }: ProductListAlertBarProps) {
  const [dismissed, setDismissed] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissing(true);
    setTimeout(() => setDismissed(true), 300);
  };

  return (
    <div
      className={`flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 transition-all ${
        dismissing ? 'max-h-0 opacity-0 overflow-hidden mb-0 py-0' : 'mb-8'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-800">
            <span className="font-bold">{alert.message}</span>
          </p>
          <p className="mt-0.5 text-xs text-amber-600">{alert.description}</p>
        </div>
      </div>
      <div className="ml-4 flex shrink-0 items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700">
          <Eye className="h-3.5 w-3.5" />
          {TEXT.viewLowStock}
        </button>
        <button
          onClick={handleDismiss}
          className="rounded-md p-1 text-amber-400 transition hover:bg-amber-100 hover:text-amber-600"
          title={TEXT.dismiss}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
