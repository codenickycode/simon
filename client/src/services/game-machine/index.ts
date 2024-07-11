import { useGameMachine } from "./game-machine";
import { usePadController } from "./pad-controller";

export const useGameController = () => {
  const gameState = useGameMachine();
  const isComputerTurn = gameState.state === "playing:computer";
  return {
    padController: usePadController({
      isComputerTurn,
      input: gameState.actions.input,
    }),
    gameState,
  };
};
