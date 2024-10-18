import type app from './index';

export type ServerApi = typeof app;

export interface HighScoreEntry {
  name: string;
  score: number;
  timestamp: number;
}
