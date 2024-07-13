import {
  getWorkerUrl,
  HighScoreEntry,
  UpdateHighScoreResponse,
  WORKER_PATH_HIGH_SCORE,
} from "@simon/shared";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const workerUrl = getWorkerUrl(import.meta.env.DEV);
const highScoreUrl = `${workerUrl}${WORKER_PATH_HIGH_SCORE}`;

const HIGH_SCORE_QUERY_KEY = "highScore";

export function useHighScoreApi({
  onMutationSuccess,
}: {
  onMutationSuccess: () => void;
}) {
  const queryClient = useQueryClient();

  const query = useQuery<HighScoreEntry>({
    queryKey: [HIGH_SCORE_QUERY_KEY],
    queryFn: async () => {
      return fetch(highScoreUrl).then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      });
    },
  });

  const mutation = useMutation({
    mutationFn: async (updateHighScore: HighScoreEntry) => {
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
    onSettled: (data: UpdateHighScoreResponse | undefined, error) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: [HIGH_SCORE_QUERY_KEY] });
        onMutationSuccess();
      } else if (data?.success === false) {
        console.warn("couldnt update high score, maybe its not high enough");
      } else if (error) {
        console.error("Mutation failed:", error);
      }
    },
  });

  return { query, mutation };
}
