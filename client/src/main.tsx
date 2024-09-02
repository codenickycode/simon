import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initAudioContext } from './services/synth.init';
import { Simon } from './simon';
import { MonitorProvider } from './services/monitor';

console.log(import.meta.env.VITE_GIT_BRANCH);

initAudioContext();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MonitorProvider>
      <QueryClientProvider client={queryClient}>
        <Simon />
      </QueryClientProvider>
    </MonitorProvider>
  </React.StrictMode>,
);
