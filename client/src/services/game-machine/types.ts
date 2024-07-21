import { PadId } from "../../components/Gamepad/types";

export type GameState = "newGame" | "computerTurn" | "userTurn" | "gameOver";

export type Transition = (params: {
  to: GameState;
  onlyIfState?: GameState;
}) => void;

export interface GameMachineState {
  state: GameState;
  userSeqIndex: number;
  userScore: number;
}

export type GameMachineAction =
  | {
      type: "transition";
      to: GameState;
      onlyIfState?: GameState;
      nextMachineState?: GameMachineState;
    }
  | {
      type: "startNewGame";
    }
  | {
      type: "input";
      padId: PadId;
    };
