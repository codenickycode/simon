import type { ReactNode } from 'react';
import { lazy, Suspense } from 'react';
import { ENV } from '../utils/env';
import { getServerUrl } from '../utils/url';
import { SentryContext } from './monitor.use-sentry';

let initd = false;

const SentryLazy = lazy(() =>
  import('@sentry/react').then((SentryReact) => {
    const SentryProvider = ({ children }: { children: ReactNode }) => {
      if (!initd) {
        SentryReact.init({
          dsn: 'https://a485f37a0cffb47b727372c209581f1e@o4507753746071552.ingest.us.sentry.io/4507753753018368',
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
        initd = true;
      }
      return (
        <SentryReact.ErrorBoundary>
          <SentryContext.Provider
            value={{ captureException: SentryReact.captureException }}
          >
            {children}
          </SentryContext.Provider>
        </SentryReact.ErrorBoundary>
      );
    };
    return {
      default: SentryProvider,
    };
  }),
);

export const Sentry = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<>{children}</>}>
      <SentryLazy>{children}</SentryLazy>
    </Suspense>
  );
};
