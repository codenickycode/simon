import classnames from "classnames";
import { PadId } from "./types";
import { pads } from "./schema";

export interface PadProps {
  padId: PadId;
  active: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
  disabled: boolean;
  className: string;
}

export const Pad = (props: PadProps) => {
  const key = pads[props.padId].key;
  return (
    <button
      onPointerDown={props.onPointerDown}
      onPointerUp={props.onPointerUp}
      className={classnames(
        "w-full aspect-square",
        props.active ? "brightness-100" : "brightness-75",
        // todo: twMerge
        props.className
      )}
      // Note: this attribute will tell the user the pad is disabled, however it
      // will still receive pointer events. To disable pointer events, add
      // pointer-events: none to classes. We allow pointer events so the user
      // can "jump start" their turn without waiting for the computer's last
      // tone to complete.
      disabled={props.disabled}
    >
      <span className="font-bold text-xl md:text-2xl">
        {props.disabled ? null : key}
      </span>
    </button>
  );
};
