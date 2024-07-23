import classnames from "classnames";
import { PadId } from "./types";
import { pads } from "./schema";

export interface PadProps {
  padId: PadId;
  active: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
  className: string;
  showKey: boolean;
}

export const Pad = (props: PadProps) => {
  const key = pads[props.padId].key;
  return (
    <button
      onPointerDown={props.onPointerDown}
      onPointerUp={props.onPointerUp}
      className={classnames(
        "w-full aspect-square cursor-pointer",
        props.active ? "brightness-100" : "brightness-75",
        // todo: twMerge
        props.className
      )}
    >
      <span className="font-bold text-xl md:text-2xl">
        {props.showKey ? key : null}
      </span>
    </button>
  );
};
