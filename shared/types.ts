import { z } from 'zod';

export interface HighScoreEntry {
  name: string;
  score: number;
  timestamp: number;
}

export interface GetHighScoreResponse {
  highScore: HighScoreEntry;
}

export const PostHighScoreBodyZ = z.object({
  name: z.string(),
  score: z.coerce.number(),
});
export type UpdateHighScoreBody = z.infer<typeof PostHighScoreBodyZ>;

export type UpdateHighScoreResponse =
  | { newHighScore: HighScoreEntry }
  | { error: string };
