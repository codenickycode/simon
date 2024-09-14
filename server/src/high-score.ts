import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import type { Context, Env } from './types';
import type { HighScoreEntry } from './types';
import { z } from 'zod';
import { getDb } from './utils';

export const highScoreRoute = new Hono<{ Bindings: Env }>()
  .get('/', async (c) => {
    const highScore = await getCurrentHighScore(c);
    return c.json({ highScore }, 200);
  })
  .post(
    '/',
    zValidator(
      'json',
      z.object({
        name: z.string(),
        score: z.coerce.number(),
      }),
    ),
    async (c) => {
      const { score, name } = c.req.valid('json');
      const currentHighScore = await getCurrentHighScore(c);
      if (score <= currentHighScore.score) {
        throw new HTTPException(400, {
          message: `The score you submitted is not higher than the current high score of ${currentHighScore.score}`,
        });
      }
      const newHighScore = {
        score,
        name: name.trim() || 'Anonymous',
        timestamp: Date.now(),
      };
      const db = getDb(c);
      await db.put('highScore', JSON.stringify(newHighScore));
      return c.json({ newHighScore }, 200);
    },
  )
  .notFound(() => {
    throw new HTTPException(404, { message: 'Not Found' });
  });

async function getCurrentHighScore(c: Context): Promise<HighScoreEntry> {
  const currentHighScore = await getDb(c).get<HighScoreEntry>(
    'highScore',
    'json',
  );
  if (!currentHighScore) {
    return { score: 0, name: 'Anonymous', timestamp: 0 };
  }
  return currentHighScore;
}
