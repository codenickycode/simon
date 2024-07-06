import { PADS, PadTone } from "../types/pad";
import { Pad } from "./Pad";

interface GamepadProps {
  activePad: PadTone | undefined;
  setActivePad: (pad: PadTone | undefined) => void;
  onInput: (padTone: PadTone) => void;
}

export const Gamepad = (props: GamepadProps) => {
  return (
    <div className="relative inline-block">
      <div className="flex flex-row">
        <Pad
          color="green"
          active={props.activePad === PADS.green.tone}
          onPointerDown={() => {
            // todo: prob dont need to do both
            props.setActivePad(PADS.green.tone);
            props.onInput(PADS.green.tone);
          }}
          onPointerUp={() => props.setActivePad(undefined)}
        />
        <Pad
          color="red"
          active={props.activePad === PADS.red.tone}
          onPointerDown={() => {
            // todo: prob dont need to do both
            props.setActivePad(PADS.red.tone);
            props.onInput(PADS.red.tone);
          }}
          onPointerUp={() => props.setActivePad(undefined)}
        />
      </div>
      <div className="flex flex-row">
        <Pad
          color="yellow"
          active={props.activePad === PADS.yellow.tone}
          onPointerDown={() => {
            // todo: prob dont need to do both
            props.setActivePad(PADS.yellow.tone);
            props.onInput(PADS.yellow.tone);
          }}
          onPointerUp={() => props.setActivePad(undefined)}
        />
        <Pad
          color="blue"
          active={props.activePad === PADS.blue.tone}
          onPointerDown={() => {
            // todo: prob dont need to do both
            props.setActivePad(PADS.blue.tone);
            props.onInput(PADS.blue.tone);
          }}
          onPointerUp={() => props.setActivePad(undefined)}
        />
      </div>
      {/* center circle */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-black rounded-full z-10"></div>
    </div>
  );
};
