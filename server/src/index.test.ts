import { describe, it, expect } from 'vitest';
import app from './index';

const mockEnv = {
  ALLOWED_ORIGIN: '*',
  ENV: 'dev',
};

describe('GET /', () => {
  it('should return status 200', async () => {
    const response = await app.request('/', { method: 'GET' }, mockEnv);
    expect(response.status).toBe(200);
  });
  it('should return "ok" text', async () => {
    const response = await app.request('/', { method: 'GET' }, mockEnv);
    expect(await response.text()).toBe('ok');
  });
});

describe('Not Found', () => {
  it('should return status 404', async () => {
    const response = await app.request('/foo', { method: 'GET' }, mockEnv);
    expect(response.status).toBe(404);
  });
  it('should return "Not Found" message', async () => {
    const response = await app.request('/foo', { method: 'GET' }, mockEnv);
    const body = await response.text();
    expect(body).toEqual('Not Found');
  });
});

describe('when not in DEV', () => {
  it('should allow any referer when env.ALLOWED_ORIGIN is "*"', async () => {
    const response = await app.request(
      '/',
      { method: 'GET', headers: { referer: 'foo.com' } },
      { ...mockEnv, ENV: 'prod', ALLOWED_ORIGIN: '*' },
    );
    expect(response.status).toBe(200);
  });
  it('should not allow any referer when env.ALLOWED_ORIGIN is set', async () => {
    const response = await app.request(
      '/',
      {
        method: 'GET',
        headers: { referer: 'foo.com' },
      },
      { ...mockEnv, ENV: 'prod', ALLOWED_ORIGIN: 'bar.com' },
    );
    expect(response.status).toBe(403);
  });
});

describe('unsupported method', () => {
  it.each(['PUT', 'PATCH', 'DELETE'])(
    '%s should return a 404',
    async (method) => {
      const response = await app.request('/', { method }, mockEnv);
      expect(response.status).toBe(404);
    },
  );
  it.each(['PUT', 'PATCH', 'DELETE'])(
    '%s should return "Not Found"',
    async (method) => {
      const response = await app.request('/', { method }, mockEnv);
      expect(await response.text()).toEqual('Not Found');
    },
  );
});
