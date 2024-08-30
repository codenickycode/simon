import type { KVNamespace } from '@cloudflare/workers-types';
import type { Context as HonoContext } from 'hono';
import type app from './index';

export interface Env {
  ALLOWED_ORIGIN: string;
  DB: KVNamespace;
  ENV: 'dev' | 'prod';
}

export type Context = HonoContext<{
  Bindings: Env;
}>;

export type ServerApi = typeof app;

export interface HighScoreEntry {
  name: string;
  score: number;
  timestamp: number;
}
