import type { Context as HonoContext } from 'hono';

export interface Env {
  DB: KVNamespace;
  ALLOWED_ORIGIN: string;
}

export type Context = HonoContext<{
  Bindings: Env;
}>;
