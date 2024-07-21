import { ReactNode } from "react";
import { useHighScoreApi } from "../services/api.high-score";
import { Spinner } from "./ui/Spinner";

export interface HighScoreProps {
  isGameOver: boolean;
  userScore: number;
}

export const HighScore = (props: HighScoreProps) => {
  const { query } = useHighScoreApi();
  return (
    <div className="w-full max-w-96 flex justify-evenly">
      <Chip>
        <p>High Score</p>
        <Spinner isSpinning={query.isFetching}>
          <p>{query.data?.score}</p>
        </Spinner>
      </Chip>
      <Chip>
        <p className="font-bold">User Score</p>
        <p>{props.userScore}</p>
      </Chip>
    </div>
  );
};

const Chip = ({ children }: { children: ReactNode }) => {
  return (
    <div className="py-1 px-2 rounded-lg bg-slate-900 font-bold text-center">
      {children}
    </div>
  );
};
