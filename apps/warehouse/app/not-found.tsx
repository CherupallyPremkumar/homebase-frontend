import Link from 'next/link';
import { Button } from '@homebase/ui';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
      <Link href="/"><Button size="lg" className="mt-6 touch-target">Go to Dashboard</Button></Link>
    </div>
  );
}
