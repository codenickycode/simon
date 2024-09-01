export const getServerUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:8787';
  }
  let subdomain = 'simon';
  if (window.location.hostname.includes('dev.')) {
    subdomain += '-dev';
  }
  return `https://${subdomain}.codenickycode.workers.dev`;
};
