import type { HighScoreEntry } from '@simon/shared';
import { getServerUrl, WORKER_PATH_HIGH_SCORE } from '@simon/shared';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';

const serverUrl = getServerUrl(import.meta.env.DEV);
const highScoreUrl = `${serverUrl}${WORKER_PATH_HIGH_SCORE}`;

const HIGH_SCORE_QUERY_KEY = 'highScore';

const DEFAULT_ERROR_REASON =
  'Unable to save high score.\nPlease check your connection and try again.';

export type GetHighScoreApi = UseQueryResult<HighScoreEntry | null, Error>;

export function useGetHighScoreApi() {
  return useQuery<HighScoreEntry>({
    queryKey: [HIGH_SCORE_QUERY_KEY],
    queryFn: async () => {
      return fetch(highScoreUrl)
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .catch((e) => {
          Sentry.captureException(e);
          return null;
        });
    },
    retry: false,
  });
}

export function useUpdateHighScoreApi(params?: {
  onSuccess?: () => void;
  onError?: (reason: string) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      updateHighScore: Pick<HighScoreEntry, 'name' | 'score'>,
    ) => {
      return fetch(highScoreUrl, {
        method: 'POST',
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
      params?.onSuccess?.();
    },
    onError: (error) => {
      const reason = getReason(error);
      params?.onError?.(reason);
      Sentry.captureException(error);
    },
  });
}

const getReason = (error: Error): string => {
  if (error.message.match('Failed to fetch')) {
    return DEFAULT_ERROR_REASON;
  }
  return error.message;
};
