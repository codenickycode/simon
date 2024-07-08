import { WORKER_URL } from "./url";
import { HighScore } from "@shared/interfaces";

const HIGH_SCORE_URL = WORKER_URL + "/high-score";

export const getHighScore = async () => {
  return fetch(HIGH_SCORE_URL).then((res) => res.json());
};

export const updateHighScore = async (newScore: HighScore) => {
  return fetch(HIGH_SCORE_URL, { method: "POST", body: newScore }).then((res) =>
    res.json()
  );
};
