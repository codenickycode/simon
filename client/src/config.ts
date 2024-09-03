import type { DeepReadonly, PadConfig, PadId } from './types';

export const ENV =
  window.location.hostname === 'simon.codenickycode.com'
    ? 'prod'
    : window.location.hostname.includes('.pages.dev')
      ? 'stage'
      : 'dev';

export const getServerUrl = () => {
  switch (ENV) {
    case 'stage':
      return 'https://simon-stage.codenickycode.workers.dev';
    case 'prod':
      return 'https://simon.codenickycode.workers.dev';
    case 'dev':
    default:
      return 'http://localhost:8787';
  }
};

export const ANIMATION_DURATION = 300;

export const PAD_SCHEMA: DeepReadonly<{ [key in PadId]: PadConfig }> = {
  green: {
    tone: 'E4',
    key: 'q',
  },
  red: {
    tone: 'C4',
    key: 'w',
  },
  blue: {
    tone: 'C5',
    key: 's',
  },
  yellow: {
    tone: 'G4',
    key: 'a',
  },
} as const;
