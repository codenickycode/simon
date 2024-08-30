import type { ServerApi } from '@simon/server';
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
    retry: false,
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
      return $post({ json: updateHighScore }).then((res) => {
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
    return 'Unable to save high score.\nPlease check your connection and try again.';
  }
  return error.message;
};
