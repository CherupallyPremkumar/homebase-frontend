'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, Heart, User } from 'lucide-react';
import { Button, Input, Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@homebase/ui';
import { useCartStore, useUIStore, useDebounce } from '@homebase/shared';
import { cn } from '@homebase/ui/src/lib/utils';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();

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
          {/* Desktop nav links */}
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

        {/* Right: Icons */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link href="/profile" className="hidden p-2 md:block" aria-label="Wishlist">
            <Heart className="h-5 w-5 text-gray-600" />
          </Link>
          <Link href="/cart" className="relative p-2" aria-label="Cart">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
          <Link href="/profile" className="hidden p-2 md:block" aria-label="Account">
            <User className="h-5 w-5 text-gray-600" />
          </Link>
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
