import type { ServerApi } from '@simon/server/src/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';
import type { InferRequestType, InferResponseType } from 'hono/client';
import { hc } from 'hono/client';
import { getServerUrl } from '../utils/url';

const serverUrl = getServerUrl();

const { $get, $post } = hc<ServerApi>(serverUrl)['high-score'];

const HIGH_SCORE_QUERY_KEY = 'highScore';

export type GetHighScoreApi = ReturnType<typeof useGetHighScoreApi>;

export function useGetHighScoreApi() {
  return useQuery({
    queryKey: [HIGH_SCORE_QUERY_KEY],
    queryFn: async () => {
      return $get()
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
  });
}

export type UpdateHighScoreApi = ReturnType<typeof useUpdateHighScoreApi>;

export function useUpdateHighScoreApi() {
  const queryClient = useQueryClient();

  return useMutation<
    InferResponseType<typeof $post>,
    Error,
    InferRequestType<typeof $post>['json']
  >({
    mutationFn: async (updateHighScore) => {
      return $post({ json: updateHighScore }).then(async (res) => {
        if (!res.ok) {
          const response = (await res.json()) as unknown as { message: string };
          throw new Error(
            response?.message ||
              'Unable to save high score.\nPlease check your connection and try again.',
          );
        }
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HIGH_SCORE_QUERY_KEY] });
    },
    onError: async (err: Error) => {
      Sentry.captureException(err);
    },
  });
}
