import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { highScoreRoute } from './high-score';
import type { Env } from './types';

const app = new Hono<{ Bindings: Env }>()
  .use('*', async (c, next) => {
    const referer = c.req.header('referer');
    const allowedOrigin = c.env.ENV === 'dev' ? '*' : c.env.ALLOWED_ORIGIN;
    if (allowedOrigin === '*' || referer?.startsWith(allowedOrigin)) {
      return cors({
        origin: allowedOrigin,
        allowMethods: ['GET', 'POST', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'baggage', 'sentry-trace'],
        exposeHeaders: ['Content-Type'],
      })(c, next);
    }
    // If referer is not allowed, fail the request
    throw new HTTPException(403, { message: 'Forbidden' });
  })
  .get('/', async (c) => c.text('ok', 200))
  .notFound(() => {
    throw new HTTPException(404, { message: 'Not Found' });
  })
  .onError((err, c) => {
    console.error(err);
    if (err instanceof HTTPException) {
      return c.json({ message: err.message }, err.status);
    }
    return c.json({ message: 'Unknown server error', cause: err }, 500);
  })
  .route('/high-score', highScoreRoute);

export default app;
