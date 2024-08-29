import type { HighScoreEntry } from '@simon/shared';
import type { Env } from './types';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export const highScoreHandler = new Hono<{ Bindings: Env }>();

highScoreHandler.get('/', async (c) => {
  const highScore = await getCurrentHighScore(c.env);
  return c.json({ highScore }, 200);
});

const UpdateHighScoreZ = z.object({
  name: z.string(),
  score: z.coerce.number(),
});

highScoreHandler.post('/', zValidator('json', UpdateHighScoreZ), async (c) => {
  try {
    const { score, name } = await c.req.json();
    const currentHighScore = await getCurrentHighScore(c.env);
    if (score > currentHighScore.score) {
      const newHighScore = {
        score,
        name: name.trim() || 'Anonymous',
        timestamp: Date.now(),
      };
      await c.env.DB.put('highScore', JSON.stringify(newHighScore));
      return c.json({ newHighScore }, 200);
    } else {
      return c.json(
        {
          error: `The score you submitted is not higher than the current high score of ${currentHighScore.score}`,
        },
        400,
      );
    }
  } catch (error) {
    return c.json(
      {
        error: (error as Error)?.message || 'Failed to update high score',
      },
      400,
    );
  }
});

highScoreHandler.notFound((c) => c.json({ message: 'Not Found' }, 404));

async function getCurrentHighScore(env: Env): Promise<HighScoreEntry> {
  const currentHighScore = await env.DB.get<HighScoreEntry>(
    'highScore',
    'json',
  );
  if (!currentHighScore) {
    return { score: 0, name: 'Anonymous', timestamp: 0 };
  }
  return currentHighScore;
}
