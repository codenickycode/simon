import { sequencer } from '../../services/sequencer';
import { gameLogic, NEW_GAME_STATE } from './logic';
import type { GameMachineAction, GameMachineState } from './types';

export const gameMachineReducer = (
  currentMachineState: GameMachineState,
  action: GameMachineAction,
): GameMachineState => {
  if (!actionGuard(currentMachineState, action)) {
    return currentMachineState;
  }
  switch (action.type) {
    case 'transition': {
      const nextMachineState = action.nextMachineState || currentMachineState;
      return { ...nextMachineState, state: action.to };
    }
    case 'startNewGame': {
      sequencer.sequence.reset();
      return { ...NEW_GAME_STATE, state: 'computerTurn' };
    }
    case 'input': {
      if (
        !gameLogic.checkInput(action.padId, currentMachineState.userSeqIndex)
      ) {
        return { ...currentMachineState, state: 'gameOver' };
      }
      const nextIdx = currentMachineState.userSeqIndex + 1;
      if (gameLogic.isSequenceComplete(nextIdx)) {
        return {
          ...currentMachineState,
          state: 'computerTurn',
          userScore: nextIdx,
          userSeqIndex: 0,
        };
      }
      return {
        ...currentMachineState,
        userSeqIndex: nextIdx,
        state: 'userTurn',
      };
    }
    default:
      throw new Error('action not implemented');
  }
};

/** Passes if action type is implemented for the current machine state */
const actionGuard = (
  currentMachineState: GameMachineState,
  action: GameMachineAction,
): boolean => {
  switch (action.type) {
    case 'transition':
      if (action.onlyIfState) {
        return action.onlyIfState === currentMachineState.state;
      }
      return true;
    case 'startNewGame':
      return ['newGame', 'gameOver'].includes(currentMachineState.state);
    case 'input':
      // computer turn is acceptable because the user can "jump start" their turn
      return ['computerTurn', 'userTurn'].includes(currentMachineState.state);
    default:
      throw new Error('action guard not implemented for action type');
  }
};
