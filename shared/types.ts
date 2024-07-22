export interface HighScoreEntry {
  name: string;
  score: number;
  timestamp: number;
}

export type UpdateHighScoreResponse =
  | { success: true; newHighScore: HighScoreEntry }
  | { success: false; error: string };
