import type { Next } from 'hono';
import type { Context } from './types';
import type { z } from 'zod';

export const zJsonMiddleware = (schema: z.ZodSchema<unknown>) => {
  return async (c: Context, next: Next) => {
    const json = await c.req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return c.json({ error: parsed.error }, 400);
    }
    await next();
  };
};
