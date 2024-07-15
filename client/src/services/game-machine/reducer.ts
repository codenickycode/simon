import { getSequencer } from "../sequencer";
import { gameLogic, NEW_GAME_STATE } from "./logic";
import { GameMachineAction, GameMachineState } from "./types";

export const gameMachineReducer = (
  currentMachineState: GameMachineState,
  action: GameMachineAction
): GameMachineState => {
  console.log(action);
  if (!actionGuard(currentMachineState, action)) {
    return currentMachineState;
  }
  switch (action.type) {
    case "transition": {
      const nextMachineState = action.nextMachineState || currentMachineState;
      return { ...nextMachineState, state: action.to };
    }
    case "startNewGame": {
      getSequencer().resetSequence();
      return { ...NEW_GAME_STATE, state: "computerTurn" };
    }
    case "input": {
      getSequencer().stopSequence(); // if user jump-started their turn
      getSequencer().playPadTone(action.padId);
      if (
        !gameLogic.checkInput(action.padId, currentMachineState.userSeqIndex)
      ) {
        return { ...currentMachineState, state: "gameOver" };
      }
      const nextIdx = currentMachineState.userSeqIndex + 1;
      if (gameLogic.isSequenceComplete(nextIdx)) {
        return {
          ...currentMachineState,
          state: "computerTurn",
          userScore: nextIdx,
          userSeqIndex: 0,
        };
      }
      return {
        ...currentMachineState,
        userSeqIndex: nextIdx,
        state: "userTurn",
      };
    }
    default:
      throw new Error("action not implemented");
  }
};

/** Passes if action type is implemented for the current machine state */
const actionGuard = (
  currentMachineState: GameMachineState,
  action: GameMachineAction
): boolean => {
  switch (action.type) {
    case "transition":
      return true;
    case "startNewGame":
      return ["newGame", "gameOver"].includes(currentMachineState.state);
    case "input":
      // the user can jump start their turn by inputting during computer turn
      return ["userTurn", "computerTurn"].includes(currentMachineState.state);
    default:
      throw new Error("action guard not implemented for action type");
  }
};
