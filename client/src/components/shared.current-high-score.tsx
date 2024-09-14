import { formatDate } from '../utils/date';
import { Button } from './ui.button';
import type { GetHighScoreApi } from '../services/api.high-score';

export const CurrentHighScore = (props: {
  getHighScoreApi: GetHighScoreApi;
}) => {
  const highScore = props.getHighScoreApi.data?.highScore;
  const error = props.getHighScoreApi.error?.message;
  return (
    <div className="mt-3 rounded-lg overflow-hidden space-y-4">
      <div className="flex flex-row space-x-6">
        {highScore ? (
          <>
            <div aria-label="global high score" className="w-8">
              <h3 className="text-sm text-slate-400">Score</h3>
              <p className="mt-1 md:text-lg font-semibold text-center">
                {highScore.score}
              </p>
            </div>
            <div aria-label="global high score user">
              <h3 className="text-sm text-slate-400">Name</h3>
              <p className="mt-1 md:text-lg  break-words">{highScore.name}</p>
            </div>
            <div aria-label="global high score date" className="w-32">
              <h3 className="text-sm text-slate-400">Date</h3>
              <p className="mt-1 md:text-lg ">
                {formatDate(highScore.timestamp ?? 0)}
              </p>
            </div>
          </>
        ) : (
          <div>
            <pre className="text-red-500 text-sm text-balance whitespace-pre-wrap mt-1 md:text-lg font-semibold mb-4">
              {error ||
                'Unable to retrieve current high score.\nPlease check your network connection.'}
            </pre>
            <Button
              variant="secondary"
              onClick={() => props.getHighScoreApi.refetch()}
            >
              retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
