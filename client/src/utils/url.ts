import { ENV } from './env';

export const getServerUrl = () => {
  switch (ENV) {
    case 'dev':
      return 'https://simon-dev.codenickycode.workers.dev';
    case 'prod':
      return 'https://simon.codenickycode.workers.dev';
    case 'local':
    default:
      return 'http://localhost:8787';
  }
};
