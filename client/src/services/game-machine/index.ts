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

  const onUserPadDown = useCallback(
    (padId: PadId) => dispatch({ type: "padDown", padId }),
    []
  );

  // *** Derived values ***
  const isUserTurn = gameMachine.state === "userTurn";
  const isComputerTurn = gameMachine.state === "computerTurn";
  const isGameOver = gameMachine.state === "gameOver";
  const userScore = gameMachine.userScore;

  // *** Components ***
  const padController = usePadController({
    onUserPadDown,
    arePadsDisabled: !isUserTurn,
  });

  // *** State Hooks ***
  useOnEntry({ state: gameMachine.state, transition });

  return {
    isComputerTurn,
    isGameOver,
    userScore,
    activePads: padController.activePads,
    actions: {
      startNewGame,
      userPadDown: padController.userPadDown,
      userPadUp: padController.userPadUp,
    },
  };
};
