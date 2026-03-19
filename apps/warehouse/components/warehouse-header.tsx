'use client';

import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@homebase/shared';
import { Avatar, AvatarFallback } from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';

export function WarehouseHeader() {
  const isOnline = useOnlineStatus();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-4">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-primary">WMS</span>
        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          Warehouse 1
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className={cn('flex items-center gap-1 text-xs', isOnline ? 'text-green-600' : 'text-red-600')}>
          {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          {isOnline ? 'Online' : 'Offline'}
        </div>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-sm text-primary">WH</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
