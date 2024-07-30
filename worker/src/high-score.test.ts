import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Env } from './types';
import { env } from 'cloudflare:test';
import worker from './index';
import { WORKER_PATH_HIGH_SCORE } from '@simon/shared';

const url = 'http://worker.com' + WORKER_PATH_HIGH_SCORE;

async function createRequest(method: string, body?: unknown): Promise<Request> {
  const init: RequestInit = { method };
  if (body) {
    init.body = JSON.stringify(body);
  }
  return new Request(url, init);
}

describe('GET', () => {
  it('should return status 200', async () => {
    const request = await createRequest('GET');
    const response = await worker.fetch(request, env as Env);
    expect(response.status).toBe(200);
  });
  it('should return current entry', async () => {
    const request = await createRequest('GET');
    const response = await worker.fetch(request, env as Env);
    // unless seeded, this will be the Anonymous:0 default
    expect(await response.json()).toEqual({
      score: 0,
      name: 'Anonymous',
      timestamp: 0,
    });
  });
});

describe('POST', () => {
  describe('when submitted score is greater than existing score', () => {
    let request: Request;
    let response: Response;
    beforeEach(async () => {
      vi.spyOn(Date, 'now').mockReturnValue(1234);
    });
    it('should return a 200 status', async () => {
      request = await createRequest('POST', { score: 1, name: 'New' });
      response = await worker.fetch(request, env as Env);
      expect(response.status).toBe(200);
    });
    it('should return the new entry', async () => {
      request = await createRequest('POST', { score: 1, name: 'New' });
      response = await worker.fetch(request, env as Env);
      expect(await response.json()).toEqual({
        newHighScore: { score: 1, name: 'New', timestamp: 1234 },
      });
    });
  });
  describe('when submitted score is not greater than existing score', () => {
    let request: Request;
    let response: Response;
    beforeEach(async () => {
      vi.spyOn(Date, 'now').mockReturnValue(1234);
      const setupReq = await createRequest('POST', { score: 2, name: 'New' });
      const setupRes = await worker.fetch(setupReq, env as Env);
      expect(setupRes.status).toBe(200);
      const initResponse = await setupRes.json();
      // @ts-expect-error response type is unknown
      expect(initResponse.newHighScore.score).toBe(2);
    });
    it('should return a 400 status', async () => {
      request = await createRequest('POST', {
        score: 1,
        name: 'Not high enough',
      });
      response = await worker.fetch(request, env as Env);
      expect(response.status).toBe(400);
    });
    it('should return an error message if lower than existing score', async () => {
      request = await createRequest('POST', {
        score: 1,
        name: 'Not high enough',
      });
      response = await worker.fetch(request, env as Env);
      expect(await response.json()).toEqual({
        error:
          'The score you submitted is not higher than the current high score of 2',
      });
    });
    it('should return an error message if equal to existing score', async () => {
      request = await createRequest('POST', {
        score: 2,
        name: 'Not high enough',
      });
      response = await worker.fetch(request, env as Env);
      expect(await response.json()).toEqual({
        error:
          'The score you submitted is not higher than the current high score of 2',
      });
    });
  });
  describe('when body is invalid', async () => {
    let request: Request;
    let response: Response;
    beforeEach(async () => {
      request = await createRequest('POST');
      Object.defineProperty(request, 'json', {
        value: () => Promise.reject(new Error('Invalid JSON')),
      });
    });
    it('should return 400 status', async () => {
      response = await worker.fetch(request, env as Env);
      expect(response.status).toBe(400);
    });
    it('should return an error message', async () => {
      response = await worker.fetch(request, env as Env);
      expect(await response.json()).toEqual({
        error: 'Invalid JSON',
      });
    });
  });
  describe('when score type is incorrect incorrect', async () => {
    it('should return 400 status', async () => {
      const request = await createRequest('POST', {
        score: 'foo',
        name: 'name',
      });
      const response = await worker.fetch(request, env as Env);
      expect(response.status).toBe(400);
    });
    it('should return an error message', async () => {
      const request = await createRequest('POST', {
        score: 'foo',
        name: 'name',
      });
      const response = await worker.fetch(request, env as Env);
      expect(await response.json()).toEqual({
        error: 'Invalid entry',
      });
    });
  });
});

describe('unsupported method', () => {
  it('should return a 404', async () => {
    const request = await createRequest('PUT');
    const response = await worker.fetch(request, env as Env);
    expect(response.status).toBe(404);
  });
  it('should return "Not Found" text', async () => {
    const request = await createRequest('PUT');
    const response = await worker.fetch(request, env as Env);
    expect(await response.text()).toBe('Not Found');
  });
});
