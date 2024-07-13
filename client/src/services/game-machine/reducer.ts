import { actions } from "./actions";
import { GameMachineAction, GameMachineState } from "./types";

export const gameMachineReducer = (
  currentState: GameMachineState,
  action: GameMachineAction
): GameMachineState => {
  switch (action.type) {
    case "transition":
      return actions.transition({ currentState, to: action.state });
    case "start":
      return actions.start({ currentState });
    case "input": {
      return actions.input({ currentState, pad: action.pad });
    }
    default:
      throw new Error("action not implemented");
  }
};
