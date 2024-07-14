import classnames from "classnames";
import { PadId } from "./types";
import { pads } from "./schema";

export interface PadProps {
  padId: PadId;
  active: boolean;
  onPointerDown: () => void;
  onDisabledPointerDown: () => void;
  onPointerUp: () => void;
  disabled: boolean;
  className: string;
}

export const Pad = (props: PadProps) => {
  const padColorClass = pads[props.padId].customPadColor;
  const borderRadiusClass = pads[props.padId].borderRadius;
  const key = pads[props.padId].key;

  const handlePointerDown = () => {
    if (props.disabled) {
      props.onDisabledPointerDown();
    } else {
      props.onPointerDown();
    }
  };
  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={props.onPointerUp}
      className={classnames(
        "w-full aspect-square pad-3d",
        padColorClass,
        borderRadiusClass,
        props.active ? "brightness-100" : "brightness-75",
        // todo: twMerge
        props.className
      )}
      disabled={props.disabled}
    >
      {props.disabled ? null : key}
    </button>
  );
};
