import type { captureException } from '@sentry/react';
import { createContext, useContext } from 'react';

export const MonitorContext = createContext<{
  captureException: typeof captureException;
} | null>(null);

export const useMonitor = () => {
  const ctx = useContext(MonitorContext);
  if (!ctx) {
    return {
      captureException: () => {
        console.warn(
          'tried to capture exception before monitor was initialized',
        );
      },
    } as unknown as { captureException: typeof captureException };
  }
  return ctx;
};
