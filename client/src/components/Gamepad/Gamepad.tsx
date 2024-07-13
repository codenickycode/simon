import { PadId } from "./types";
import { Pad } from "./Pad";

interface GamepadProps {
  activePad: PadId | undefined;
  onPadDown: (padId: PadId) => void;
  isComputerTurn: boolean;
}

export const Gamepad = (props: GamepadProps) => {
  return (
    <div className="relative inline-block">
      <div className="flex flex-row">
        <Pad
          padId="green"
          active={props.activePad === "green"}
          onPointerDown={() => props.onPadDown("green")}
          disabled={props.isComputerTurn}
        />
        <Pad
          padId="red"
          active={props.activePad === "red"}
          onPointerDown={() => props.onPadDown("red")}
          disabled={props.isComputerTurn}
        />
      </div>
      <div className="flex flex-row">
        <Pad
          padId="yellow"
          active={props.activePad === "yellow"}
          onPointerDown={() => props.onPadDown("yellow")}
          disabled={props.isComputerTurn}
        />
        <Pad
          padId="blue"
          active={props.activePad === "blue"}
          onPointerDown={() => props.onPadDown("blue")}
          disabled={props.isComputerTurn}
        />
      </div>
      {/* center circle */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-black rounded-full z-10"></div>
    </div>
  );
};
