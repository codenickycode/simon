import { PADS, PadTone } from "../types/pad";
import { Pad } from "./Pad";

interface GamepadProps {
  activePad: PadTone | undefined;
  setActivePad: (pad: PadTone | undefined) => void;
}

export const Gamepad = (props: GamepadProps) => {
  return (
    <div className="relative inline-block">
      <div className="flex flex-row">
        <Pad
          color="green"
          active={props.activePad === PADS.green.tone}
          onPointerDown={() => props.setActivePad(PADS.green.tone)}
          onPointerUp={() => props.setActivePad(undefined)}
        />
        <Pad
          color="red"
          active={props.activePad === PADS.red.tone}
          onPointerDown={() => props.setActivePad(PADS.red.tone)}
          onPointerUp={() => props.setActivePad(undefined)}
        />
      </div>
      <div className="flex flex-row">
        <Pad
          color="yellow"
          active={props.activePad === PADS.yellow.tone}
          onPointerDown={() => props.setActivePad(PADS.yellow.tone)}
          onPointerUp={() => props.setActivePad(undefined)}
        />
        <Pad
          color="blue"
          active={props.activePad === PADS.blue.tone}
          onPointerDown={() => props.setActivePad(PADS.blue.tone)}
          onPointerUp={() => props.setActivePad(undefined)}
        />
      </div>
      {/* center circle */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-black rounded-full z-10"></div>
    </div>
  );
};
