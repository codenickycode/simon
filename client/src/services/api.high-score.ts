import {
  getWorkerUrl,
  HighScoreEntry,
  WORKER_PATH_HIGH_SCORE,
} from "@simon/shared";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const workerUrl = getWorkerUrl(import.meta.env.DEV);
const highScoreUrl = `${workerUrl}${WORKER_PATH_HIGH_SCORE}`;

const HIGH_SCORE_QUERY_KEY = "highScore";

export function useHighScoreApi() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [HIGH_SCORE_QUERY_KEY],
    queryFn: () => {
      return fetch(highScoreUrl).then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      });
    },
  });

  const mutation = useMutation({
    mutationFn: (updateHighScore: HighScoreEntry) => {
      return fetch(highScoreUrl, {
        method: "POST",
        body: JSON.stringify(updateHighScore),
      }).then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HIGH_SCORE_QUERY_KEY] });
    },
  });

  return { query, mutation };
}
