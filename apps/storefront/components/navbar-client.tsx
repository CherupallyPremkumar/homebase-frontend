'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, Heart, LogIn, ChevronDown } from 'lucide-react';
import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
} from '@homebase/ui';
import { useCartStore, useUIStore } from '@homebase/shared';

interface NavbarClientProps {
  user: { name?: string | null; email?: string | null } | null;
}

/**
 * Client Component — handles interactivity (search, cart, dropdown).
 * Receives user data as props from the Server Component (Navbar).
 * No useAuth(), no /api/auth/session call, nothing in Network tab.
 */
export function NavbarClient({ user }: NavbarClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();

  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo + menu */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/" className="text-xl font-bold text-primary">
            HomeBase
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link href="/categories" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Categories
            </Link>
          </nav>
        </div>

        {/* Center: Search bar (desktop) */}
        <div className="hidden max-w-md flex-1 px-8 md:block">
          <form action="/search" className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              name="q"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </form>
        </div>

        {/* Right: Auth-aware actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search toggle */}
          <button
            className="p-2 md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Wishlist — only show if logged in */}
          {isAuthenticated && (
            <Link href="/profile#wishlist" className="hidden p-2 md:block" aria-label="Wishlist">
              <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
            </Link>
          )}

          {/* Cart — always visible */}
          <Link href="/cart" className="relative p-2" aria-label="Cart">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Auth section */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-full p-1 hover:bg-gray-100 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                      {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium text-gray-700 md:block">
                    {user.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-gray-400 md:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/returns">My Returns</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/api/auth/logout" className="text-red-600">Sign Out</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <a href="/api/auth/signin/keycloak">
              <Button variant="outline" size="sm" className="gap-1.5">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="border-t px-4 py-2 md:hidden">
          <form action="/search" className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              name="q"
              placeholder="Search products..."
              autoFocus
              className="pl-10"
            />
          </form>
        </div>
      )}
    </header>
  );
}
