import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Context, Env } from './types';

export const testRoute = new Hono<{ Bindings: Env }>()
  .post('/reset', async (c) => {
    if (c.env.ENV !== 'test') {
      console.warn(`cannot reset db in env: ${c.env.ENV}`);
      throw new HTTPException(404, { message: 'Not Found' });
    }
    await resetDb(c);
  })
  .notFound(() => {
    throw new HTTPException(404, { message: 'Not Found' });
  });

/** Explicitly use c.env.TEST_DB and not getDb() to be sure we are only
 * adjusting the local test db binding */
const resetDb = async (c: Context) => {
  await c.env.TEST_DB.delete('highScore');
};
