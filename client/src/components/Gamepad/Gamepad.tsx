import { ActivePads, PadId } from "./types";
import { Pad } from "./Pad";
import { isPadActive } from "../../utils/pads";

interface GamepadProps {
  activePads: ActivePads;
  onPadDown: (padId: PadId) => void;
  onPadUp: (padId: PadId) => void;
  isComputerTurn: boolean;
}

export const Gamepad = (props: GamepadProps) => {
  return (
    <div className="relative inline-block">
      <div className="flex flex-row">
        <Pad
          padId="green"
          active={isPadActive("green", props.activePads)}
          onPointerDown={() => props.onPadDown("green")}
          onPointerUp={() => props.onPadUp("green")}
          disabled={props.isComputerTurn}
        />
        <Pad
          padId="red"
          active={isPadActive("red", props.activePads)}
          onPointerDown={() => props.onPadDown("red")}
          onPointerUp={() => props.onPadUp("red")}
          disabled={props.isComputerTurn}
        />
      </div>
      <div className="flex flex-row">
        <Pad
          padId="yellow"
          active={isPadActive("yellow", props.activePads)}
          onPointerDown={() => props.onPadDown("yellow")}
          onPointerUp={() => props.onPadUp("yellow")}
          disabled={props.isComputerTurn}
        />
        <Pad
          padId="blue"
          active={isPadActive("blue", props.activePads)}
          onPointerDown={() => props.onPadDown("blue")}
          onPointerUp={() => props.onPadUp("blue")}
          disabled={props.isComputerTurn}
        />
      </div>
      {/* center circle */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-black rounded-full z-10"></div>
    </div>
  );
};
