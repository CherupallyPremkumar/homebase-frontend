'use client';

import { ErrorPage } from '@homebase/shared';

export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorPage {...props} appName="Backoffice" homeHref="/" />;
}
