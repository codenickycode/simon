import type { PadId } from '../types';

export type GameState = 'newGame' | 'computerTurn' | 'userTurn' | 'gameOver';

export type Transition = (params: { to: GameState }) => void;

export interface GameMachineState {
  state: GameState;
  userSeqIndex: number;
  userScore: number;
}

export type GameMachineAction =
  | {
      type: 'transition';
      to: GameState;
      nextMachineState?: GameMachineState;
    }
  | {
      type: 'startNewGame';
    }
  | {
      type: 'input';
      padId: PadId;
    };
