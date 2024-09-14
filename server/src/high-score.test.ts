import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testClient } from 'hono/testing';
import app from './index';

const HIGH_SCORE_URL = 'http://server.com/high-score';

// unless seeded, this will be the Anonymous:0 default
const DEFAULT_ENTRY = {
  score: 0,
  name: 'Anonymous',
  timestamp: 0,
};

const mockEnv = {
  DB: {
    get: vi.fn().mockResolvedValue(DEFAULT_ENTRY),
    put: vi.fn().mockResolvedValue(DEFAULT_ENTRY),
  },
  ALLOWED_HOST: '*',
  ENV: 'test',
};

describe('GET', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it('should return status 200', async () => {
    const response = await testClient(app, mockEnv)['high-score'].$get();
    expect(response.status).toBe(200);
  });
  it('should return current entry', async () => {
    const response = await testClient(app, mockEnv)['high-score'].$get();
    const result = await response.json();
    expect(result).toEqual({ highScore: DEFAULT_ENTRY });
  });
});

describe('POST', () => {
  beforeEach(async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1234);
  });
  describe('when submitted score is greater than existing score', () => {
    it('should return a 200 status', async () => {
      const response = await testClient(app, mockEnv)['high-score'].$post({
        json: { score: 1, name: 'New' },
      });
      expect(response.status).toBe(200);
    });
    it('should return the new entry', async () => {
      const response = await testClient(app, mockEnv)['high-score'].$post({
        json: { score: 1, name: 'New' },
      });
      expect(await response.json()).toEqual({
        newHighScore: { score: 1, name: 'New', timestamp: 1234 },
      });
    });
  });
  describe('when submitted score is not greater than existing score', () => {
    beforeEach(async () => {
      mockEnv.DB.get.mockResolvedValueOnce({
        score: 2,
        name: 'User1',
      });
    });
    it('should return a 400 status', async () => {
      const response = await testClient(app, mockEnv)['high-score'].$post({
        json: { score: 1, name: 'Not high enough' },
      });
      expect(response.status).toBe(400);
    });
    it('should return an error message if lower than existing score', async () => {
      const response = await testClient(app, mockEnv)['high-score'].$post({
        json: { score: 1, name: 'Not high enough' },
      });
      expect(await response.json()).toEqual({
        message:
          'The score you submitted is not higher than the current high score of 2',
      });
    });
    it('should return an error message if equal to existing score', async () => {
      const response = await testClient(app, mockEnv)['high-score'].$post({
        json: { score: 2, name: 'Not high enough' },
      });
      expect(await response.json()).toEqual({
        message:
          'The score you submitted is not higher than the current high score of 2',
      });
    });
  });
  describe.each([
    ['invalid score', { score: 'foo', name: 'valid' }],
    ['invalid name', { score: 100, name: undefined }],
  ])('when given an %s', async (_, body) => {
    it('should return 400 status', async () => {
      const response = await app.request(
        HIGH_SCORE_URL,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
        mockEnv,
      );
      expect(response.status).toBe(400);
    });
    it('should return an error message', async () => {
      const response = await app.request(
        HIGH_SCORE_URL,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
        mockEnv,
      );
      expect(await response.json()).toEqual({
        success: false,
        error: {
          name: 'ZodError',
          issues: [
            expect.objectContaining({
              code: 'invalid_type',
            }),
          ],
        },
      });
    });
  });
});

describe('unsupported method', () => {
  it.each(['PUT', 'PATCH', 'DELETE'])(
    '%s should return a 404',
    async (method) => {
      const response = await app.request(HIGH_SCORE_URL, { method }, mockEnv);
      expect(response.status).toBe(404);
    },
  );
  it.each(['PUT', 'PATCH', 'DELETE'])(
    '%s should return "Not Found"',
    async (method) => {
      const response = await app.request(HIGH_SCORE_URL, { method }, mockEnv);
      expect(await response.json()).toEqual({ message: 'Not Found' });
    },
  );
});
