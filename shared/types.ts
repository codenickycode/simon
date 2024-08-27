export interface HighScoreEntry {
  name: string;
  score: number;
  timestamp: number;
}

export interface GetHighScoreResponse {
  highScore: HighScoreEntry;
}

export type UpdateHighScoreResponse =
  | { newHighScore: HighScoreEntry }
  | { error: string };
