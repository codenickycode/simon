import { useCallback, useReducer } from "react";
import { PadTone } from "../../types/pad";
import { GameStatus, GameStateReducer } from "./types";
import { gameStateReducer } from "./reducer";
import { useOnEntry } from "./hooks";

const INITIAL_STATE: GameStateReducer = {
  status: "idle",
  userSeqIndex: 0,
};

export const useGameMachine = () => {
  const [gameState, dispatch] = useReducer(gameStateReducer, INITIAL_STATE);
  /** Transition to the provided game status */
  const transition = useCallback(
    (status: GameStatus) => dispatch({ type: "transition", status }),
    []
  );
  /** Start a new game */
  const start = useCallback(() => dispatch({ type: "start" }), []);
  /** User inputs a pad press */
  const input = useCallback(
    (pad: PadTone) => dispatch({ type: "input", pad }),
    []
  );
  useOnEntry({ status: gameState.status, transition });
  return {
    status: gameState.status,
    actions: {
      start,
      input,
    },
  };
};
