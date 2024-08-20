import * as Sentry from '@sentry/react';
import { getServerUrl } from '@simon/shared';

const isDev = import.meta.env.DEV;

export const initMonitoring = () => {
  Sentry.init({
    dsn: 'https://a485f37a0cffb47b727372c209581f1e@o4507753746071552.ingest.us.sentry.io/4507753753018368',
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
