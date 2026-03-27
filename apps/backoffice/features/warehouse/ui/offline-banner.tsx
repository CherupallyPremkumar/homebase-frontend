'use client';

import { useOnlineStatus } from '@homebase/shared';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-red-600 px-4 py-2 text-sm font-medium text-white">
      <WifiOff className="h-4 w-4" />
      You are offline. Changes will sync when connection is restored.
    </div>
  );
}
