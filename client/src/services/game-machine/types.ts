import { PadTone } from "../../components/Gamepad/types";

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
      to: GameState;
      nextMachineState?: GameMachineState;
    }
  | {
      type: "startNewGame";
    }
  | {
      type: "padDown";
      pad: PadTone;
    }
  | {
      type: "padUp";
      pad: PadTone;
    };
