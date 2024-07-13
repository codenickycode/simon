import classnames from "classnames";
import { PadId } from "./types";
import { pads } from "./schema";

export interface PadProps {
  padId: PadId;
  active: boolean;
  onPointerDown: () => void;
  disabled: boolean;
}

export const Pad = (props: PadProps) => {
  const bgActiveClass = pads[props.padId].bgActiveColor;
  const bgClass = props.active ? bgActiveClass : pads[props.padId].bgColor;
  const borderRadiusClass = pads[props.padId].borderRadius;
  const key = pads[props.padId].key;
  return (
    <button
      onPointerDown={props.onPointerDown}
      className={classnames(
        "w-16 h-16 disabled:pointer-events-none",
        bgClass,
        borderRadiusClass
      )}
      disabled={props.disabled}
    >
      {key}
    </button>
  );
};
