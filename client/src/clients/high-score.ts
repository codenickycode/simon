import { WORKER_URL } from "./url";
import { HighScore } from "../../../shared/interfaces";
import { PATH_HIGH_SCORE } from "../../../shared/url";

const HIGH_SCORE_URL = WORKER_URL + PATH_HIGH_SCORE;

export const getHighScore = async () => {
  return fetch(HIGH_SCORE_URL).then((res) => res.json());
};

export const updateHighScore = async (newScore: HighScore) => {
  console.log(JSON.stringify(newScore));
  return fetch(HIGH_SCORE_URL, {
    method: "POST",
    body: JSON.stringify(newScore),
  }).then((res) => res.json());
};
