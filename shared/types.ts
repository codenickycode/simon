export interface HighScoreEntry {
  name: string;
  score: number;
  timestamp: number;
}

export type UpdateHighScoreResponse =
  | { newHighScore: HighScoreEntry }
  | { error: string };
