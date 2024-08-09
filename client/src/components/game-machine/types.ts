import type { PadId } from '../../components/pad-controller';

export type GameState = 'newGame' | 'computerTurn' | 'userTurn' | 'gameOver';

export type Transition = (params: {
  to: GameState;
  /** This acts as a guard in case state has already transitioned to a different
   * one. This can happen in the case of an async callback. */
  onlyIfState?: GameState;
}) => void;

export interface GameMachineState {
  state: GameState;
  userSeqIndex: number;
  userScore: number;
}

export type GameMachineAction =
  | {
      type: 'transition';
      to: GameState;
      onlyIfState?: GameState;
      nextMachineState?: GameMachineState;
    }
  | {
      type: 'startNewGame';
    }
  | {
      type: 'input';
      padId: PadId;
    };
