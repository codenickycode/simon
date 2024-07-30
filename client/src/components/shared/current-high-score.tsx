import { formatDate } from '../../utils/date';
import type { HighScoreEntry } from '@simon/shared';

export const CurrentHighScore = (props: {
  highScore: HighScoreEntry | undefined;
}) => {
  return (
    <div className="mt-3 rounded-lg overflow-hidden space-y-4">
      <div className="flex flex-row space-x-6">
        {props.highScore ? (
          <>
            <div className="w-8">
              <h3 className="text-sm text-slate-400">Score</h3>
              <p className="mt-1 md:text-lg font-semibold text-center">
                {props.highScore.score}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-slate-400">Name</h3>
              <p className="mt-1 md:text-lg  break-words">
                {props.highScore.name}
              </p>
            </div>
            <div className="w-32">
              <h3 className="text-sm text-slate-400">Date</h3>
              <p className="mt-1 md:text-lg ">
                {formatDate(props.highScore.timestamp ?? 0)}
              </p>
            </div>
          </>
        ) : (
          <div>
            <pre className="text-red-500 text-sm text-balance whitespace-pre-wrap mt-1 md:text-lg font-semibold ">
              Unable to retrieve current high score. Please check your network
              connection.
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
