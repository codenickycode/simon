import * as Sentry from '@sentry/react';
import { getServerUrl } from '@simon/shared';

const isDev = import.meta.env.DEV;

export const initMonitoring = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: isDev ? 'development' : 'production',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ['localhost', getServerUrl(isDev)],
    // limit sampling on production
    replaysSessionSampleRate: isDev ? 1 : 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};
