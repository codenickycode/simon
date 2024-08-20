import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initMonitoring } from './services/monitor.init';
import { initAudioContext } from './services/synth.init';
import { Simon } from './simon';

initMonitoring();
initAudioContext();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Simon />
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
);
