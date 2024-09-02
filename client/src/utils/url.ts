import { ENV } from './env';

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
