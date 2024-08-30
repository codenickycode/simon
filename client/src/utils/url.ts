export const getServerUrl = () => {
  return import.meta.env.DEV
    ? 'http://localhost:8787'
    : 'https://simon.codenickycode.workers.dev';
};
