import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono/client';
import { hc } from 'hono/client';
import { useMonitor } from './monitor.use-monitor';
import { getServerUrl } from '../config';
import type { ServerApi } from 'types.shared';

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
            const error = await parseError(res);
            throw error;
          }
          return res.json();
        })
        .catch((error) => {
          captureException(error);
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
          const error = await parseError(res);
          throw error;
        }
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HIGH_SCORE_QUERY_KEY] });
    },
    onError: (error) => {
      captureException(error);
    },
  });
}

const DEFAULT_MESSAGE =
  'Request to high score failed.\nPlease check your connection and try again.';

const parseError = async (err: unknown): Promise<Error> => {
  if (err instanceof Response) {
    const json = await err.json();
    const message = json?.message || DEFAULT_MESSAGE;
    return new Error(message, { cause: err });
  }
  if (err instanceof Error) {
    return err;
  }
  return new Error(DEFAULT_MESSAGE, { cause: err });
};
