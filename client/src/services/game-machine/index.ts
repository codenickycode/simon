import { useCallback, useReducer } from "react";
import { PadId } from "../../components/Gamepad/types";
import { GameState } from "./types";
import { gameMachineReducer } from "./reducer";
import { useOnEntry } from "./hooks";
import { NEW_GAME_STATE } from "./logic";
import { usePadController } from "./pad-controller";

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
  const padDown = useCallback(
    (padId: PadId) => dispatch({ type: "padDown", padId }),
    []
  );

  // *** Components ***
  const { activePad } = usePadController({
    onPadDown: padDown,
  });

  // *** State Hooks ***
  useOnEntry({ state: gameMachine.state, transition });

  // *** Derived values ***
  const isComputerTurn = gameMachine.state === "computerTurn";
  const isGameOver = gameMachine.state === "gameOver";
  const userScore = gameMachine.userScore;

  return {
    isComputerTurn,
    isGameOver,
    userScore,
    activePad,
    actions: {
      startNewGame,
      padDown,
    },
  };
};
