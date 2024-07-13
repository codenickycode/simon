import { useCallback, useReducer } from "react";
import { PadTone } from "../../types/pad";
import { GameStatus, GameMachineState } from "./types";
import { gameStateReducer } from "./reducer";
import { useOnEntry } from "./hooks";

const INITIAL_STATE: GameMachineState = {
  status: "idle",
  userSeqIndex: 0,
};

export const useGameMachine = () => {
  const [gameState, dispatch] = useReducer(gameStateReducer, INITIAL_STATE);
  const transition = useCallback(
    (status: GameStatus) => dispatch({ type: "transition", status }),
    []
  );
  const start = useCallback(() => dispatch({ type: "start" }), []);
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
