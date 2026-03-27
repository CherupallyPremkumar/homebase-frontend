import { auth } from '@/auth';
import { NavbarClient } from './navbar-client';

export async function Navbar() {
  const session = await auth().catch(() => null);

  const user = session?.user
    ? { name: session.user.name || null, email: session.user.email || null }
    : null;

  return <NavbarClient user={user} />;
}
