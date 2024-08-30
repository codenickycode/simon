import type app from './index';

export interface HighScoreEntry {
  name: string;
  score: number;
  timestamp: number;
}

export type ServerApi = typeof app;
