import { PadTone } from "../../types/pad";

export type GameStatus = "newGame" | "computerTurn" | "userTurn" | "gameOver";

export type Transition = (to: GameStatus) => void;

export interface GameMachineState {
  status: GameStatus;
  userSeqIndex: number;
  userScore: number;
}

export type GameMachineAction =
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
