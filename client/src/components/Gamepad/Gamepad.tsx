import { ActivePads, PadId } from "./types";
import { Pad } from "./Pad";
import { isPadActive, padKeyToPadId } from "../../utils/pads";
import { useEffect } from "react";

interface GamepadProps {
  activePads: ActivePads;
  onUserPadDown: (padId: PadId) => void;
  onUserPadUp: (padId: PadId) => void;
  isComputerTurn: boolean;
  isUserTurn: boolean;
}

export const Gamepad = (props: GamepadProps) => {
  useKeyListeners({
    onUserPadDown: props.onUserPadDown,
    onUserPadUp: props.onUserPadUp,
  });
  return (
    <div className="w-full aspect-square rounded-full bg-black flex items-center justify-center">
      <div className="relative w-80 grid grid-cols-2">
        <Pad
          padId="green"
          active={isPadActive("green", props.activePads)}
          onPointerDown={() => props.onUserPadDown("green")}
          onPointerUp={() => props.onUserPadUp("green")}
          disabled={!props.isUserTurn}
          className="justify-self-end self-end pad-color-green rounded-tl-full"
        />
        <Pad
          padId="red"
          active={isPadActive("red", props.activePads)}
          onPointerDown={() => props.onUserPadDown("red")}
          onPointerUp={() => props.onUserPadUp("red")}
          disabled={!props.isUserTurn}
          className="self-end pad-color-red rounded-tr-full"
        />
        <Pad
          padId="yellow"
          active={isPadActive("yellow", props.activePads)}
          onPointerDown={() => props.onUserPadDown("yellow")}
          onPointerUp={() => props.onUserPadUp("yellow")}
          disabled={!props.isUserTurn}
          className="justify-self-end pad-color-yellow rounded-bl-full"
        />
        <Pad
          padId="blue"
          active={isPadActive("blue", props.activePads)}
          onPointerDown={() => props.onUserPadDown("blue")}
          onPointerUp={() => props.onUserPadUp("blue")}
          disabled={!props.isUserTurn}
          className="pad-color-blue rounded-br-full"
        />
        {/* center circle */}
        <div className="absolute inset-0 m-auto rounded-full w-32 aspect-square bg-black"></div>
      </div>
    </div>
  );
};

const useKeyListeners = ({
  onUserPadDown,
  onUserPadUp,
}: {
  onUserPadDown: (padId: PadId) => void;
  onUserPadUp: (padId: PadId) => void;
}) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        event.preventDefault();
        return;
      }
      const padId = padKeyToPadId(event.key);
      if (!padId) {
        return;
      }
      onUserPadDown(padId);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onUserPadDown]);

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      const padId = padKeyToPadId(event.key);
      if (!padId) {
        return;
      }
      onUserPadUp(padId);
    };
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [onUserPadUp]);
};
