import { sequencer } from "../sequencer";
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
      sequencer.resetSequence();
      return { ...NEW_GAME_STATE, state: "computerTurn" };
    }
    case "input": {
      sequencer.stopSequence();
      sequencer.playPadTone(action.padId);
      if (
        // if not user turn (or not user jump-starting their turn during computer playback)
        !["computerTurn", "userTurn"].includes(currentMachineState.state)
      ) {
        // nothing to do after playing the tone
        return currentMachineState;
      }
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
      if (action.onlyIfState) {
        return action.onlyIfState === currentMachineState.state;
      }
      return true;
    case "startNewGame":
      return ["newGame", "gameOver"].includes(currentMachineState.state);
    case "input":
      return true;
    default:
      throw new Error("action guard not implemented for action type");
  }
};
