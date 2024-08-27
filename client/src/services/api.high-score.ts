import type {
  GetHighScoreResponse,
  HighScoreEntry,
  UpdateHighScoreResponse,
} from '@simon/shared';
import { getServerUrl, WORKER_PATH_HIGH_SCORE } from '@simon/shared';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';

const serverUrl = getServerUrl(import.meta.env.DEV);
const highScoreUrl = `${serverUrl}${WORKER_PATH_HIGH_SCORE}`;

const HIGH_SCORE_QUERY_KEY = 'highScore';

const DEFAULT_ERROR_REASON =
  'Unable to save high score.\nPlease check your connection and try again.';

export type GetHighScoreApi = UseQueryResult<
  GetHighScoreResponse | null,
  Error
>;

export function useGetHighScoreApi(): GetHighScoreApi {
  return useQuery({
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

export type UpdateHighScoreApi = UseMutationResult<
  UpdateHighScoreResponse,
  Error,
  Pick<HighScoreEntry, 'name' | 'score'>,
  unknown
>;

export function useUpdateHighScoreApi(): UpdateHighScoreApi {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateHighScore) => {
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
    },
    onError: (error) => {
      Sentry.captureException(error);
    },
  });
}

export const getUpdateErrorReason = (error: Error): string => {
  if (error.message.match('Failed to fetch')) {
    return DEFAULT_ERROR_REASON;
  }
  return error.message;
};
