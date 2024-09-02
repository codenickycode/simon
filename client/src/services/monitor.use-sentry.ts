import type { captureException } from '@sentry/react';
import { createContext, useContext } from 'react';

export const SentryContext = createContext<{
  captureException: typeof captureException;
} | null>(null);

export const useSentry = () => {
  const ctx = useContext(SentryContext);
  if (!ctx) {
    return {
      captureException: () => {
        console.warn('tried to capture exception before Sentry loaded');
      },
    } as unknown as { captureException: typeof captureException };
  }
  return ctx;
};
