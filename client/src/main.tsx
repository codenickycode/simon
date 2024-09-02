import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initAudioContext } from './services/synth.init';
import { Simon } from './simon';
import { Sentry } from './services/monitor';

initAudioContext();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sentry>
      <QueryClientProvider client={queryClient}>
        <Simon />
      </QueryClientProvider>
    </Sentry>
  </React.StrictMode>,
);
