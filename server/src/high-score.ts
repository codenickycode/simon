import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import type { Env } from './types';
import type { HighScoreEntry } from './types';
import { z } from 'zod';
import { getDb } from './utils';

export const highScoreRoute = new Hono<{ Bindings: Env }>()
  .get('/', async (c) => {
    const db = getDb(c);
    const highScore = await getCurrentHighScore(db);
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
      const db = getDb(c);
      const { score, name } = c.req.valid('json');
      const currentHighScore = await getCurrentHighScore(db);
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
      await db.put('highScore', JSON.stringify(newHighScore));
      return c.json({ newHighScore }, 200);
    },
  )
  .notFound(() => {
    throw new HTTPException(404, { message: 'Not Found' });
  });

async function getCurrentHighScore(db: KVNamespace): Promise<HighScoreEntry> {
  const currentHighScore = await db.get<HighScoreEntry>('highScore', 'json');
  if (!currentHighScore) {
    return { score: 0, name: 'Anonymous', timestamp: 0 };
  }
  return currentHighScore;
}
