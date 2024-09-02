import type { KVNamespace } from '@cloudflare/workers-types';
import type { Context as HonoContext } from 'hono';
import type app from './index';

export interface Env {
  ALLOWED_HOST: string;
  DB: KVNamespace;
  ENV: 'dev' | 'prod' | 'stage';
  GITHUB_REF_NAME: string;
  GITHUB_SHA: string;
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
