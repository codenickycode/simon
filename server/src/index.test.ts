import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import app from './index';

describe('GET /', () => {
  it('should return status 200', async () => {
    const response = await app.request('/', { method: 'GET' });
    expect(response.status).toBe(200);
  });
  it('should return "ok" text', async () => {
    const response = await app.request('/', { method: 'GET' });
    expect(await response.text()).toBe('ok');
  });
});

describe('Not Found', () => {
  it('should return status 404', async () => {
    const response = await app.request('/foo', { method: 'GET' });
    expect(response.status).toBe(404);
  });
  it('should return "Not Found" message', async () => {
    const response = await app.request('/foo', { method: 'GET' });
    expect(await response.json()).toEqual({ message: 'Not Found' });
  });
});

describe('when not in DEV', () => {
  beforeEach(() => {
    import.meta.env.DEV = false;
  });
  afterEach(() => {
    import.meta.env.DEV = true;
  });
  it('should allow any origin when env.ALLOWED_ORIGIN is "*"', async () => {
    const response = await app.request(
      '/',
      { method: 'GET', headers: { origin: 'foo.com' } },
      { ALLOWED_ORIGIN: '*' },
    );
    expect(response.status).toBe(200);
  });
  it('should not allow any origin when env.ALLOWED_ORIGIN is set', async () => {
    const response = await app.request(
      '/',
      {
        method: 'GET',
        headers: { origin: 'foo.com' },
      },
      { ALLOWED_ORIGIN: 'bar.com' },
    );
    expect(response.status).toBe(403);
  });
});
