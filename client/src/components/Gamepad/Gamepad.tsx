import { PadTone } from "./types";
import { Pad } from "./Pad";
import { pads } from "./schema";

interface GamepadProps {
  activePad: PadTone | undefined;
  onPadDown: (padTone: PadTone) => void;
  isComputerTurn: boolean;
}

export const Gamepad = (props: GamepadProps) => {
  return (
    <div className="relative inline-block">
      <div className="flex flex-row">
        <Pad
          padId="green"
          active={props.activePad === pads.green.tone}
          onPointerDown={() => props.onPadDown(pads.green.tone)}
          disabled={props.isComputerTurn}
        />
        <Pad
          padId="red"
          active={props.activePad === pads.red.tone}
          onPointerDown={() => props.onPadDown(pads.red.tone)}
          disabled={props.isComputerTurn}
        />
      </div>
      <div className="flex flex-row">
        <Pad
          padId="yellow"
          active={props.activePad === pads.yellow.tone}
          onPointerDown={() => props.onPadDown(pads.yellow.tone)}
          disabled={props.isComputerTurn}
        />
        <Pad
          padId="blue"
          active={props.activePad === pads.blue.tone}
          onPointerDown={() => props.onPadDown(pads.blue.tone)}
          disabled={props.isComputerTurn}
        />
      </div>
      {/* center circle */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-black rounded-full z-10"></div>
    </div>
  );
};
