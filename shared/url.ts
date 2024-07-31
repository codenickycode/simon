export const WORKER_PATH_HIGH_SCORE = '/high-score';

export const getServerUrl = (isDev: boolean) => {
  return isDev
    ? 'http://localhost:8787'
    : 'https://simon.codenickycode.workers.dev';
};
