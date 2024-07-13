import { actions } from "./actions";
import { GameMachineAction, GameMachineState } from "./types";

export const gameStateReducer = (
  currentState: GameMachineState,
  action: GameMachineAction
): GameMachineState => {
  switch (action.type) {
    case "transition":
      return actions.transition({ currentState, to: action.status });
    case "start":
      return actions.start({ currentState });
    case "input": {
      return actions.input({ currentState, pad: action.pad });
    }
    default:
      throw new Error("action not implemented");
  }
};
