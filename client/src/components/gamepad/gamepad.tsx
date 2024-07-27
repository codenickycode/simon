import type { useGameMachine } from "../game-machine";
import { HighScore } from "./high-score";
import { Button } from "../ui-elements/button";
import { Pads } from "./pads";
import type { usePadController } from "../pad-controller";

interface GamepadProps {
  gameMachine: ReturnType<typeof useGameMachine>;
  padController: ReturnType<typeof usePadController>;
}

export const Gamepad = ({ gameMachine, padController }: GamepadProps) => {
  return (
    <div className="w-full h-full flex flex-col landscape:flex-row max-w-screen-2xl items-center justify-evenly">
      <div className="h-24 landscape:h-auto w-full flex items-center justify-center">
        {!gameMachine.isPlaying && <HighScore />}
      </div>
      <div>
        <Pads
          isPlaying={gameMachine.isPlaying}
          isUserTurn={gameMachine.isUserTurn}
          currentScore={gameMachine.currentScore}
          padController={padController}
        />
      </div>
      <div className="h-24 landscape:h-auto w-full flex items-center justify-center">
        {!gameMachine.isPlaying && (
          <Button onClick={gameMachine.actions.startNewGame}>
            <span className="text-xl md:text-2xl font-bold">start</span>
          </Button>
        )}
      </div>
    </div>
  );
};
