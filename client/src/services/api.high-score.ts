import type { ServerApi } from '@simon/server/src/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono/client';
import { hc } from 'hono/client';
import { getServerUrl } from '../utils/url';
import { useSentry } from './monitor.use-sentry';

const serverUrl = getServerUrl();

const { $get, $post } = hc<ServerApi>(serverUrl)['high-score'];

const HIGH_SCORE_QUERY_KEY = 'highScore';

export type GetHighScoreApi = ReturnType<typeof useGetHighScoreApi>;

export function useGetHighScoreApi() {
  const { captureException } = useSentry();
  return useQuery({
    queryKey: [HIGH_SCORE_QUERY_KEY],
    queryFn: async () => {
      return $get()
        .then(async (res) => {
          if (!res.ok) {
            const error = await getError(
              res,
              'Unable to retrieve current high score. Please check your network connection.',
            );
            throw error;
          }
          return res.json();
        })
        .catch((e) => {
          captureException(e);
          return null;
        });
    },
  });
}

export type UpdateHighScoreApi = ReturnType<typeof useUpdateHighScoreApi>;

export function useUpdateHighScoreApi() {
  const queryClient = useQueryClient();
  const { captureException } = useSentry();
  return useMutation<
    InferResponseType<typeof $post>,
    Error,
    InferRequestType<typeof $post>['json']
  >({
    mutationFn: async (updateHighScore) => {
      return $post({ json: updateHighScore }).then(async (res) => {
        if (!res.ok) {
          const error = await getError(
            res,
            'Unable to save high score.\nPlease check your connection and try again.',
          );
          throw error;
        }
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HIGH_SCORE_QUERY_KEY] });
    },
    onError: async (err: Error) => {
      captureException(err);
    },
  });
}

const getError = async (
  res: Response,
  defaultMessage: string,
): Promise<Error> => {
  const response = (await res.json()) as unknown as { message: string };
  return new Error(response?.message || defaultMessage);
};
