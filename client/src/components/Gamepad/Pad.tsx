import classnames from "classnames";
import { PadId } from "./types";
import { pads } from "./schema";

export interface PadProps {
  padId: PadId;
  active: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
  disabled: boolean;
  bypassDisabled: boolean;
}

export const Pad = (props: PadProps) => {
  const bgActiveClass = pads[props.padId].bgActiveColor;
  const bgClass = props.active ? bgActiveClass : pads[props.padId].bgColor;
  const borderRadiusClass = pads[props.padId].borderRadius;
  const key = pads[props.padId].key;

  const handlePointerDown = () => {
    if (!props.disabled || props.bypassDisabled) {
      props.onPointerDown();
    }
  };

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={props.onPointerUp}
      className={classnames("w-16 h-16", bgClass, borderRadiusClass)}
      disabled={props.disabled}
    >
      {key}
    </button>
  );
};
