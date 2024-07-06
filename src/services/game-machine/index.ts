import { useCallback, useMemo } from "react";
import { useMachine } from "@xstate/react";
import { usePadController } from "./pad-controller";
import { setupStateMachine } from "./state-machine";

export const useGameController = () => {
  const stateMachine = useMemo(() => setupStateMachine(), []);
  const [state, send] = useMachine(stateMachine);
  const isComputerTurn = ["_computerTurn", "computerTurn"].includes(
    // @ts-expect-error it's a complex type
    state.value?.playing
  );
  return {
    padController: usePadController({ isComputerTurn, send }),
    gameState: {
      startSequence: useCallback(() => send({ type: "start" }), [send]),
      highScore: state.context.highScore,
      isComputerTurn,
      state,
    },
  };
};
