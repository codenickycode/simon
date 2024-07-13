import { useCallback, useReducer } from "react";
import { PadTone } from "../../types/pad";
import { GameStatus } from "./types";
import { gameStateReducer } from "./reducer";
import { useOnEntry } from "./hooks";
import { NEW_GAME_STATE } from "./logic";

export const useGameMachine = () => {
  const [gameState, dispatch] = useReducer(gameStateReducer, NEW_GAME_STATE);

  // *** Actions ***
  const transition = useCallback(
    (status: GameStatus) => dispatch({ type: "transition", status }),
    []
  );
  const start = useCallback(() => dispatch({ type: "start" }), []);
  const input = useCallback(
    (pad: PadTone) => dispatch({ type: "input", pad }),
    []
  );

  // *** Hooks ***
  useOnEntry({ status: gameState.status, transition });

  // *** Derived values ***
  const isComputerTurn = gameState.status === "computerTurn";
  const userScore = gameState.userScore;

  return {
    isComputerTurn,
    userScore,
    actions: {
      start,
      input,
    },
  };
};
