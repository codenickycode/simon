import type { ServerApi } from '@simon/server/src/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono/client';
import { hc } from 'hono/client';
import { getServerUrl } from '../utils/url';
import { useMonitor } from './monitor.use-monitor';

const serverUrl = getServerUrl();

const { $get, $post } = hc<ServerApi>(serverUrl)['high-score'];

const HIGH_SCORE_QUERY_KEY = 'highScore';

export type GetHighScoreApi = ReturnType<typeof useGetHighScoreApi>;

export function useGetHighScoreApi() {
  const { captureException } = useMonitor();
  return useQuery({
    queryKey: [HIGH_SCORE_QUERY_KEY],
    queryFn: async () => {
      return $get()
        .then(async (res) => {
          if (!res.ok) {
            const error = await getHighScoreError(res);
            throw error;
          }
          return res.json();
        })
        .catch(async (err) => {
          captureException(err);
          return null;
        });
    },
  });
}

export type UpdateHighScoreApi = ReturnType<typeof useUpdateHighScoreApi>;

export function useUpdateHighScoreApi() {
  const queryClient = useQueryClient();
  const { captureException } = useMonitor();
  return useMutation<
    InferResponseType<typeof $post>,
    Error,
    InferRequestType<typeof $post>['json']
  >({
    mutationFn: async (updateHighScore) => {
      return $post({ json: updateHighScore }).then(async (res) => {
        if (!res.ok) {
          const error = await getHighScoreError(res);
          throw error;
        }
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HIGH_SCORE_QUERY_KEY] });
    },
    onError: async (error) => {
      captureException(error);
    },
  });
}

const DEFAULT_MESSAGE =
  'Request to high score failed.\nPlease check your connection and try again.';

export const getHighScoreError = async (err: unknown): Promise<Error> => {
  if (err instanceof Error) {
    if (err.message === 'Failed to fetch') {
      err.message = DEFAULT_MESSAGE;
    }
    return err;
  }
  if (err instanceof Response) {
    const json = await err.json();
    const message = json?.message || DEFAULT_MESSAGE;
    return new Error(message, { cause: err });
  }
  return new Error(DEFAULT_MESSAGE, { cause: err });
};
