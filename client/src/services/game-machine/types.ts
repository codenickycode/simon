import { PadTone } from "../../types/pad";

export type GameStatus = "idle" | "computerTurn" | "userTurn" | "gameOver";

export type Transition = (to: GameStatus) => void;

export interface GameStateReducer {
  status: GameStatus;
  userSeqIndex: number;
}

export type GameStateAction =
  | {
      type: "transition";
      status: GameStatus;
    }
  | {
      type: "start";
    }
  | {
      type: "input";
      pad: PadTone;
    };
