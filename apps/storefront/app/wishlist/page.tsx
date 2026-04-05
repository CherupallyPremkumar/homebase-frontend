import type { Metadata } from 'next';
import { WishlistPage } from './wishlist-page';

export const metadata: Metadata = { title: 'My Wishlist' };

export default function Page() {
  return <WishlistPage />;
}
