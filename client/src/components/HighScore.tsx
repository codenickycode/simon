import { useEffect, useState } from "react";
import { getHighScore, updateHighScore } from "../clients/high-score";
import { HighScore } from "../../../shared/interfaces";

export const HighScore = () => {
  const [currentHighScore, setCurrentHighScore] = useState<
    HighScore | undefined
  >();
  useEffect(() => {
    (async () => {
      const result = await getHighScore();
      setCurrentHighScore(result);
    })();
  }, []);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await updateHighScore({ name: "Nick", score: 1 });
    setCurrentHighScore(result);
  };
  return (
    <div>
      <h1>
        High score: {currentHighScore?.score} by {currentHighScore?.name}
      </h1>
      <form onSubmit={handleSubmit}>
        <button type="submit">update high score</button>
      </form>
    </div>
  );
};
