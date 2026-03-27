import Link from 'next/link';
import { Button } from '@homebase/ui';

interface NotFoundPageProps {
  homeHref?: string;
  homeLinkText?: string;
  extraLinks?: Array<{ href: string; label: string }>;
}

export function NotFoundPage({
  homeHref = '/',
  homeLinkText = 'Go home',
  extraLinks,
}: NotFoundPageProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">Page not found</h2>
      <p className="mt-2 text-gray-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <div className="mt-6 flex gap-3">
        <Link href={homeHref}>
          <Button>{homeLinkText}</Button>
        </Link>
        {extraLinks?.map((link) => (
          <Link key={link.href} href={link.href}>
            <Button variant="outline">{link.label}</Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
