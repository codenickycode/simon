import { highScoreHandler } from './high-score';
import type { Env } from './types.cf';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono<{ Bindings: Env }>()
  .use('*', async (c, next) => {
    const referer = c.req.header('referer');
    const allowedOrigin = c.env.ENV === 'dev' ? '*' : c.env.ALLOWED_ORIGIN;
    if (allowedOrigin === '*' || referer === allowedOrigin) {
      return cors({
        origin: allowedOrigin,
        allowMethods: ['GET', 'POST', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'baggage', 'sentry-trace'],
        exposeHeaders: ['Content-Type'],
      })(c, next);
    }
    // If referer is not allowed, fail the request
    return c.text('Forbidden', 403);
  })
  .get('/', async (c) => c.text('ok', 200))
  .notFound((c) => c.json({ message: 'Not Found' }, 404))
  .onError((err, c) => {
    return c.json({ message: 'Unknown server error', cause: err }, 500);
  })
  .route('/high-score', highScoreHandler);

export default app;
