import classnames from "classnames";
import { PADS, PadColor } from "../../types/pad";

const bgColor: { [key in PadColor]: string } = {
  green: "bg-green-600",
  red: "bg-red-600",
  blue: "bg-blue-600",
  yellow: "bg-yellow-600",
};
const bgActiveColor: { [key in PadColor]: string } = {
  green: "bg-green-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
};
const borderRadius: { [key in PadColor]: string } = {
  green: "rounded-tl-full",
  red: "rounded-tr-full",
  blue: "rounded-br-full",
  yellow: "rounded-bl-full",
};

export interface PadProps {
  color: PadColor;
  active: boolean;
  onPointerDown: () => void;
  disabled: boolean;
}

export const Pad = (props: PadProps) => {
  const bgActiveClass = bgActiveColor[props.color];
  const bgClass = props.active ? bgActiveClass : bgColor[props.color];
  const borderRadiusClass = borderRadius[props.color];
  const key = PADS[props.color].key;
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
