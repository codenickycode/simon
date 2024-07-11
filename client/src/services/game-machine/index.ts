import { useGameMachine } from "./game-machine";
import { usePadController } from "./pad-controller";

export const useGameController = () => {
  const gameState = useGameMachine();
  const isComputerTurn = gameState.state === "computerTurn";
  return {
    padController: usePadController({
      isComputerTurn,
      input: gameState.actions.input,
    }),
    gameState,
  };
};
