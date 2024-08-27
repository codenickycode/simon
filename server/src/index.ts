import { WORKER_PATH_HIGH_SCORE } from '@simon/shared';
import { highScoreHandler } from './high-score';
import type { Env } from './types';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono<{ Bindings: Env }>();

app.use('*', async (c, next) => {
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
});

app.route(WORKER_PATH_HIGH_SCORE, highScoreHandler);

app.get('/', async (c) => {
  return c.text('ok', 200);
});

app.notFound((c) => c.json({ message: 'Not Found' }, 404));

app.onError((err, c) => {
  return c.json({ message: 'Unknown server error', cause: err }, 500);
});

export default app;
