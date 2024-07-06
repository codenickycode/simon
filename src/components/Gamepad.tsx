import { PADS, PadTone } from "../types/pad";
import { Pad } from "./Pad";

interface GamepadProps {
  activePad: PadTone | undefined;
  onPadDown: (padTone: PadTone) => void;
  onPadUp: () => void;
}

export const Gamepad = (props: GamepadProps) => {
  return (
    <div className="relative inline-block">
      <div className="flex flex-row">
        <Pad
          color="green"
          active={props.activePad === PADS.green.tone}
          onPointerDown={() => props.onPadDown(PADS.green.tone)}
          onPointerUp={() => props.onPadUp()}
        />
        <Pad
          color="red"
          active={props.activePad === PADS.red.tone}
          onPointerDown={() => props.onPadDown(PADS.red.tone)}
          onPointerUp={() => props.onPadUp()}
        />
      </div>
      <div className="flex flex-row">
        <Pad
          color="yellow"
          active={props.activePad === PADS.yellow.tone}
          onPointerDown={() => props.onPadDown(PADS.yellow.tone)}
          onPointerUp={() => props.onPadUp()}
        />
        <Pad
          color="blue"
          active={props.activePad === PADS.blue.tone}
          onPointerDown={() => props.onPadDown(PADS.blue.tone)}
          onPointerUp={() => props.onPadUp()}
        />
      </div>
      {/* center circle */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-black rounded-full z-10"></div>
    </div>
  );
};
