'use client';

import Link from 'next/link';
import { Wifi, WifiOff, LogOut, LayoutDashboard } from 'lucide-react';
import { useOnlineStatus } from '@homebase/shared';
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from '@homebase/ui';
import { cn } from '@homebase/ui/src/lib/utils';

interface HeaderProps {
  user?: { name?: string | null; email?: string | null; roles?: string[] } | null;
}

export function WarehouseHeader({ user }: HeaderProps) {
  const isOnline = useOnlineStatus();
  const isAdmin = user?.roles?.includes('ADMIN');

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-4">
      <div className="flex items-center gap-3">
        {isAdmin && (
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
            title="Back to dashboard"
          >
            <LayoutDashboard className="h-4 w-4" />
          </Link>
        )}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-sm text-primary">
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'W'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {user && (
              <>
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => { window.location.href = '/api/auth/logout'; }}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
