import { useGameMachine } from "../../services/game-machine";
import { HighScore } from "./high-score";
import { Button } from "../ui-elements/button";
import { Pads } from "./pads";

export const Gamepad = (props: ReturnType<typeof useGameMachine>) => {
  return (
    <div className="w-full h-full flex flex-col landscape:flex-row max-w-screen-xl items-center justify-evenly">
      <div className="h-24 landscape:h-auto w-full flex items-center justify-center">
        {!props.isPlaying && <HighScore />}
      </div>
      <div>
        <Pads
          isPlaying={props.isPlaying}
          isUserTurn={props.isUserTurn}
          onUserPadDown={props.actions.input}
          currentScore={props.currentScore}
        />
      </div>
      <div className="h-24 landscape:h-auto w-full flex items-center justify-center">
        {!props.isPlaying && (
          <Button onClick={props.actions.startNewGame}>
            <span className="text-xl md:text-2xl font-bold">start</span>
          </Button>
        )}
      </div>
    </div>
  );
};
