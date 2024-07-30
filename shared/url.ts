export const WORKER_PATH_HIGH_SCORE = '/high-score';

export const getWorkerUrl = (isDev: boolean) => {
  return isDev
    ? 'http://localhost:8787'
    : 'https://https://simon.codenickycode.workers.dev';
};
