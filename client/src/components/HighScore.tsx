import { useHighScoreApi } from "../services/api.high-score";
import { Spinner } from "./ui/Spinner";

export const HighScore = () => {
  const { query } = useHighScoreApi();
  return (
    <div className="font-bold text-center flex items-center">
      <p className="md:text-lg">
        High Score:<span className="mx-1"></span>
        <Spinner isSpinning={query.isFetching}>{query.data?.score}</Spinner>
      </p>
    </div>
  );
};
