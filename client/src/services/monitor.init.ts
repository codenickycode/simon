import * as Sentry from '@sentry/react';
import { ENV } from '../utils/env';
import { getServerUrl } from '../utils/url';

export const initMonitoring = () => {
  Sentry.init({
    dsn: 'https://a485f37a0cffb47b727372c209581f1e@o4507753746071552.ingest.us.sentry.io/4507753753018368',
    environment: ENV,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ['localhost', getServerUrl()],
    // limit sampling on production
    replaysSessionSampleRate: ENV !== 'prod' ? 1 : 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};
