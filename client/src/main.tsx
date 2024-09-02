import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initAudioContext } from './services/synth.init';
import { Simon } from './simon';
import { MonitorProvider } from './services/monitor';

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

console.log(`branch: ${import.meta.env.GIT_BRANCH}`);
console.log(`commit: ${import.meta.env.GIT_SHA}`);
