export const ENV =
  window.location.hostname === 'simon.codenickycode.com'
    ? 'prod'
    : window.location.hostname.includes('.pages.dev')
      ? 'stage'
      : 'dev';
