import { ActivePads, PadId } from "./types";
import { Pad } from "./Pad";
import { isPadActive } from "../../utils/pads";

interface GamepadProps {
  activePads: ActivePads;
  onPadDown: (padId: PadId) => void;
  onPadUp: (padId: PadId) => void;
  isComputerTurn: boolean;
  isUserTurn: boolean;
}

export const Gamepad = (props: GamepadProps) => {
  /** We allow pointer down while disabled and the machine will check if they
   * can "jump start" their turn */
  const onDisabledPointerDown = props.onPadDown;
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 w-full aspect-square rounded-full bg-black grid grid-cols-2">
        <Pad
          padId="green"
          active={isPadActive("green", props.activePads)}
          onPointerDown={() => props.onPadDown("green")}
          onDisabledPointerDown={() => onDisabledPointerDown("green")}
          onPointerUp={() => props.onPadUp("green")}
          disabled={!props.isUserTurn}
        />
        <Pad
          padId="red"
          active={isPadActive("red", props.activePads)}
          onPointerDown={() => props.onPadDown("red")}
          onDisabledPointerDown={() => onDisabledPointerDown("red")}
          onPointerUp={() => props.onPadUp("red")}
          disabled={!props.isUserTurn}
        />
        <Pad
          padId="yellow"
          active={isPadActive("yellow", props.activePads)}
          onPointerDown={() => props.onPadDown("yellow")}
          onDisabledPointerDown={() => onDisabledPointerDown("yellow")}
          onPointerUp={() => props.onPadUp("yellow")}
          disabled={!props.isUserTurn}
        />
        <Pad
          padId="blue"
          active={isPadActive("blue", props.activePads)}
          onPointerDown={() => props.onPadDown("blue")}
          onDisabledPointerDown={() => onDisabledPointerDown("blue")}
          onPointerUp={() => props.onPadUp("blue")}
          disabled={!props.isUserTurn}
        />
      </div>
      {/* center circle */}
      <div className="rounded-full absolute inset-0 w-1/4 h-1/4 bg-blue-600"></div>
    </div>
  );
};
