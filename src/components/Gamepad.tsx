import { PAD_TONES, PadTone } from "../types/pad";
import { Pad } from "./Pad";

interface GamepadProps {
  activePad: PadTone | undefined;
}

export const Gamepad = (props: GamepadProps) => {
  return (
    <div className="relative inline-block">
      <div className="flex flex-row">
        <Pad color="green" active={props.activePad === PAD_TONES.green} />
        <Pad color="red" active={props.activePad === PAD_TONES.red} />
      </div>
      <div className="flex flex-row">
        <Pad color="yellow" active={props.activePad === PAD_TONES.yellow} />
        <Pad color="blue" active={props.activePad === PAD_TONES.blue} />
      </div>
      {/* center circle */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-black rounded-full z-10"></div>
    </div>
  );
};
