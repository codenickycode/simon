import type { ReactNode } from 'react';
import { lazy, Suspense } from 'react';
import { ENV } from '../utils/env';
import { getServerUrl } from '../utils/url';
import { MonitorContext } from './monitor.use-monitor';

const SENTRY_DSN =
  'https://a485f37a0cffb47b727372c209581f1e@o4507753746071552.ingest.us.sentry.io/4507753753018368';

const SentryLazy = lazy(() =>
  import('@sentry/react').then((SentryReact) => {
    SentryReact.init({
      dsn: SENTRY_DSN,
      environment: ENV,
      integrations: [
        SentryReact.browserTracingIntegration(),
        SentryReact.replayIntegration(),
      ],
      tracesSampleRate: 1.0,
      tracePropagationTargets: ['localhost', getServerUrl()],
      // limit sampling on production
      replaysSessionSampleRate: ENV !== 'prod' ? 1 : 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
    console.log('monitor initialized');
    const SentryProvider = ({ children }: { children: ReactNode }) => {
      return (
        <SentryReact.ErrorBoundary>
          <MonitorContext.Provider
            value={{ captureException: SentryReact.captureException }}
          >
            {children}
          </MonitorContext.Provider>
        </SentryReact.ErrorBoundary>
      );
    };
    return {
      default: SentryProvider,
    };
  }),
);

export const MonitorProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<>{children}</>}>
      <SentryLazy>{children}</SentryLazy>
    </Suspense>
  );
};
