import { useCallback, useMemo } from "react";
import { useMachine } from "@xstate/react";
import { usePadController } from "./pad-controller";
import { setupStateMachine } from "./state-machine";

export const useGameController = () => {
  const stateMachine = useMemo(() => setupStateMachine(), []);
  const [state, send] = useMachine(stateMachine);
  return {
    padController: usePadController({ send }),
    gameState: {
      startSequence: useCallback(() => send({ type: "start" }), [send]),
      highScore: state.context.highScore,
      state,
    },
  };
};
