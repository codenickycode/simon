import { PadId } from "./types";
import { Pad } from "./Pad";
import { isPadActive } from "../../utils/pads";
import { usePadController } from "./pad-controller";

interface GamepadProps {
  isComputerTurn: boolean;
  isUserTurn: boolean;
  onUserPadDown: (padId: PadId) => void;
}

export const Gamepad = (props: GamepadProps) => {
  const padController = usePadController({
    onUserPadDown: props.onUserPadDown,
  });
  return (
    <div className="w-full aspect-square rounded-full bg-black flex items-center justify-center">
      <div className="relative w-80 grid grid-cols-2">
        <Pad
          padId="green"
          active={isPadActive("green", padController.activePads)}
          onPointerDown={() => padController.userPadDown("green")}
          onPointerUp={() => padController.userPadUp("green")}
          disabled={!props.isUserTurn}
          className="justify-self-end self-end pad-color-green rounded-tl-full"
        />
        <Pad
          padId="red"
          active={isPadActive("red", padController.activePads)}
          onPointerDown={() => padController.userPadDown("red")}
          onPointerUp={() => padController.userPadUp("red")}
          disabled={!props.isUserTurn}
          className="self-end pad-color-red rounded-tr-full"
        />
        <Pad
          padId="yellow"
          active={isPadActive("yellow", padController.activePads)}
          onPointerDown={() => padController.userPadDown("yellow")}
          onPointerUp={() => padController.userPadUp("yellow")}
          disabled={!props.isUserTurn}
          className="justify-self-end pad-color-yellow rounded-bl-full"
        />
        <Pad
          padId="blue"
          active={isPadActive("blue", padController.activePads)}
          onPointerDown={() => padController.userPadDown("blue")}
          onPointerUp={() => padController.userPadUp("blue")}
          disabled={!props.isUserTurn}
          className="pad-color-blue rounded-br-full"
        />
        {/* center circle */}
        <div className="absolute inset-0 m-auto rounded-full w-32 aspect-square bg-black"></div>
      </div>
    </div>
  );
};
