import type { Context as HonoContext } from 'hono';

export interface Env {
  ALLOWED_ORIGIN: string;
  DB: KVNamespace;
  ENV: 'dev' | 'prod';
}

export type Context = HonoContext<{
  Bindings: Env;
}>;
