import { NotFoundPage } from '@homebase/shared';

export default function NotFound() {
  return (
    <NotFoundPage
      homeLinkText="Go home"
      extraLinks={[{ href: '/products', label: 'Browse products' }]}
    />
  );
}
