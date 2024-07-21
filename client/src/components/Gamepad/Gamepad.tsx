import { PadId } from "./types";
import { Pad } from "./Pad";
import { isPadActive } from "../../utils/pads";
import { usePadController } from "./pad-controller";
import classNames from "classnames";

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
    <div className="w-80 aspect-square rounded-full bg-slate-900 border-4 border-slate-950 flex items-center justify-center">
      <div className="relative w-[95%] grid grid-cols-2 gap-1">
        <Pad
          padId="green"
          active={isPadActive("green", padController.activePads)}
          onPointerDown={() => padController.userPadDown("green")}
          onPointerUp={() => padController.userPadUp("green")}
          disabled={!props.isUserTurn}
          className={classNames(
            "justify-self-end self-end rounded-tl-full text-green-600",
            isPadActive("green", padController.activePads)
              ? "bg-green-500"
              : "bg-green-700"
          )}
        />
        <Pad
          padId="red"
          active={isPadActive("red", padController.activePads)}
          onPointerDown={() => padController.userPadDown("red")}
          onPointerUp={() => padController.userPadUp("red")}
          disabled={!props.isUserTurn}
          className={classNames(
            "self-end rounded-tr-full text-rose-500",
            isPadActive("red", padController.activePads)
              ? "bg-rose-500"
              : "bg-rose-700"
          )}
        />
        <Pad
          padId="yellow"
          active={isPadActive("yellow", padController.activePads)}
          onPointerDown={() => padController.userPadDown("yellow")}
          onPointerUp={() => padController.userPadUp("yellow")}
          disabled={!props.isUserTurn}
          className={classNames(
            "justify-self-end rounded-bl-full text-amber-500",
            isPadActive("yellow", padController.activePads)
              ? "bg-amber-400"
              : "bg-amber-600"
          )}
        />
        <Pad
          padId="blue"
          active={isPadActive("blue", padController.activePads)}
          onPointerDown={() => padController.userPadDown("blue")}
          onPointerUp={() => padController.userPadUp("blue")}
          disabled={!props.isUserTurn}
          className={classNames(
            "rounded-br-full text-blue-500",
            isPadActive("blue", padController.activePads)
              ? "bg-blue-500"
              : "bg-blue-700"
          )}
        />
        {/* center circle */}
        <div className="absolute inset-0 m-auto rounded-full w-28 aspect-square bg-slate-950 border-4 border-slate-900"></div>
      </div>
    </div>
  );
};
