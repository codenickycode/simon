import classnames from "classnames";
import { useEffect, useState } from "react";
import { PadColor } from "../types/pad";
import { playTone } from "../services/tone";

export interface PadProps {
  color: PadColor;
  active: boolean;
}

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

const chars: { [key in PadColor]: string } = {
  green: "q",
  red: "w",
  blue: "s",
  yellow: "a",
};

export const Pad = (props: PadProps) => {
  const [pressing, setPressing] = useState(false);
  const handlePointerDown = () => {
    setPressing(true);
    playTone(props.color);
  };
  const handlePointerUp = () => setPressing(false);
  const active = props.active || pressing;
  const bgActiveClass = bgActiveColor[props.color];
  const bgClass = active ? bgActiveClass : bgColor[props.color];
  const borderRadiusClass = borderRadius[props.color];
  const char = chars[props.color];
  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (event.key === chars[props.color]) {
        if (!pressing) playTone(props.color);
        setPressing(true);
      }
    };
    const handleKeyUp = (event: { key: string }) => {
      if (event.key === chars[props.color]) {
        setPressing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [pressing, props.color]);
  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className={classnames("w-16 h-16", bgClass, borderRadiusClass)}
    >
      {char}
    </button>
  );
};
