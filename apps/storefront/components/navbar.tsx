import Link from 'next/link';
import { ShoppingCart, Heart, LogIn } from 'lucide-react';
import { auth } from '@/auth';
import { NavbarClient } from './navbar-client';

/**
 * Server Component — reads session from cookie server-side.
 * No /api/auth/session call. Nothing in Network tab.
 * User data is baked into HTML before it reaches the browser.
 */
export async function Navbar() {
  const session = await auth();

  const user = session?.user
    ? { name: session.user.name || null, email: session.user.email || null }
    : null;

  return <NavbarClient user={user} />;
}
