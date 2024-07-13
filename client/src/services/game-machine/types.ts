import { PadTone } from "../../types/pad";

export type GameState = "newGame" | "computerTurn" | "userTurn" | "gameOver";

export type Transition = (to: GameState) => void;

export interface GameMachineState {
  state: GameState;
  userSeqIndex: number;
  userScore: number;
}

export type GameMachineAction =
  | {
      type: "transition";
      state: GameState;
    }
  | {
      type: "start";
    }
  | {
      type: "input";
      pad: PadTone;
    };
