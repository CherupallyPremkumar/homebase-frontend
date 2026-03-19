import Link from 'next/link';
import { Button } from '@homebase/ui';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">Page not found</h2>
      <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/">
          <Button>Go home</Button>
        </Link>
        <Link href="/products">
          <Button variant="outline">Browse products</Button>
        </Link>
      </div>
    </div>
  );
}
