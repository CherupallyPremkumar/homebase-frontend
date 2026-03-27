'use client';

import { useEffect, useRef, useState } from 'react';

export function AutoSignIn({
  callbackUrl,
  prompt,
}: {
  callbackUrl: string;
  prompt?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);

  const action = prompt
    ? `/api/auth/signin/keycloak?prompt=${prompt}`
    : '/api/auth/signin/keycloak';

  useEffect(() => {
    fetch('/api/auth/csrf')
      .then((r) => r.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch(() => setShowManual(true));

    const fallback = setTimeout(() => setShowManual(true), 4000);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (csrfToken && formRef.current) {
      formRef.current.requestSubmit();
    }
  }, [csrfToken]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <form
        ref={formRef}
        method="POST"
        action={action}
        className="hidden"
      >
        <input type="hidden" name="csrfToken" value={csrfToken ?? ''} />
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      </form>

      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
      <p className="text-sm text-gray-400">Redirecting to login...</p>

      {showManual && (
        <button
          onClick={() => formRef.current?.requestSubmit()}
          className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
        >
          Click here if not redirected
        </button>
      )}
    </div>
  );
}
