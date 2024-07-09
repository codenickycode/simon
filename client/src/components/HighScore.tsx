import { useHighScoreApi } from "../services/api.high-score";

export interface HighScoreProps {}

export const HighScore = (props: HighScoreProps) => {
  const { query, mutation } = useHighScoreApi();

  return (
    <div>
      <h1>High Score: {JSON.stringify(query.data, null, 2)}</h1>
      <button onClick={() => mutation.mutate({ name: "nick", score: 1 })}>
        update
      </button>
    </div>
  );
};
