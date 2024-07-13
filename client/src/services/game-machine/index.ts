import { useCallback, useReducer } from "react";
import { PadTone } from "../../types/pad";
import { GameState } from "./types";
import { gameMachineReducer } from "./reducer";
import { useOnEntry } from "./hooks";
import { NEW_GAME_STATE } from "./logic";

export const useGameMachine = () => {
  const [gameMachine, dispatch] = useReducer(
    gameMachineReducer,
    NEW_GAME_STATE
  );
  console.log(gameMachine);

  // *** Actions ***
  const transition = useCallback(
    (to: GameState) => dispatch({ type: "transition", to }),
    []
  );
  const startNewGame = useCallback(
    () => dispatch({ type: "startNewGame" }),
    []
  );
  const input = useCallback(
    (pad: PadTone) => dispatch({ type: "input", pad }),
    []
  );

  // *** Hooks ***
  useOnEntry({ state: gameMachine.state, transition });

  // *** Derived values ***
  const isComputerTurn = gameMachine.state === "computerTurn";
  const isGameOver = gameMachine.state === "gameOver";
  const userScore = gameMachine.userScore;

  return {
    isComputerTurn,
    isGameOver,
    userScore,
    actions: {
      startNewGame,
      input,
    },
  };
};
