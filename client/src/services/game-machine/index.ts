import { useCallback, useReducer } from "react";
import { PadId } from "../../components/Gamepad/types";
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
    (to: GameState, onlyIfState?: GameState) =>
      dispatch({ type: "transition", to, onlyIfState }),
    []
  );
  const startNewGame = useCallback(
    () => dispatch({ type: "startNewGame" }),
    []
  );
  const input = useCallback(
    (padId: PadId) => dispatch({ type: "input", padId }),
    []
  );

  // *** Derived values ***
  const isComputerTurn = gameMachine.state === "computerTurn";
  const isGameOver = gameMachine.state === "gameOver";
  const isUserTurn = gameMachine.state === "userTurn";
  const userScore = gameMachine.userScore;

  // *** State Hooks ***
  useOnEntry({ state: gameMachine.state, transition });

  return {
    isComputerTurn,
    isGameOver,
    isUserTurn,
    userScore,
    actions: {
      startNewGame,
      input,
    },
  };
};
