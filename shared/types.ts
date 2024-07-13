export interface HighScoreEntry {
  name: string;
  score: number;
}

export type UpdateHighScoreResponse =
  | { success: true; newHighScore: HighScoreEntry }
  | { success: false; currentHighScore: HighScoreEntry }
  | { success: false; error: string };
