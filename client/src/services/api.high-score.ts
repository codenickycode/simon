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

const DEFAULT_ERROR_REASON =
  "Unable to save high score.\nPlease check your connection and try again.";

export function useHighScoreApi(params?: {
  onMutationSuccess?: () => void;
  onMutationError?: (reason: string) => void;
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
        params?.onMutationSuccess?.();
      } else {
        const reason = getReason(data, error);
        params?.onMutationError?.(reason);
      }
    },
  });

  return { query, mutation };
}

const getReason = (
  data: UpdateHighScoreResponse | undefined,
  error: Error | null
): string => {
  if (!data) {
    if (!error) {
      return DEFAULT_ERROR_REASON;
    }
    if (error.message.match("Failed to fetch")) {
      return DEFAULT_ERROR_REASON;
    }
    return error.message;
  }
  if (data.success === false) {
    return data.error;
  }
  return DEFAULT_ERROR_REASON;
};
