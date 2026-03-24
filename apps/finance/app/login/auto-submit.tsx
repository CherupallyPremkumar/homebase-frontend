'use client';

import { useEffect, useRef } from 'react';

export function AutoSubmitForm({ action }: { action: () => Promise<void> }) {
  const submitted = useRef(false);

  useEffect(() => {
    if (!submitted.current) {
      submitted.current = true;
      (document.getElementById('auto-login-form') as HTMLFormElement)?.requestSubmit();
    }
  }, []);

  return (
    <form id="auto-login-form" action={action} className="flex h-screen items-center justify-center">
      <p className="text-gray-400">Redirecting to login...</p>
      <noscript>
        <button type="submit" className="ml-4 rounded bg-blue-600 px-4 py-2 text-white">
          Sign in
        </button>
      </noscript>
    </form>
  );
}
