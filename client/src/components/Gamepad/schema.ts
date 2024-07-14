import { DeepReadonly } from "../../types";
import { PadConfig, PadId } from "./types";

export const pads: DeepReadonly<{ [key in PadId]: PadConfig }> = {
  green: {
    tone: "E4",
    key: "q",
    customPadColor: "pad-color-green",
    borderRadius: "rounded-tl-full",
  },
  red: {
    tone: "C#4",
    key: "w",
    customPadColor: "pad-color-red",
    borderRadius: "rounded-tr-full",
  },
  blue: {
    tone: "E5",
    key: "s",
    customPadColor: "pad-color-blue",
    borderRadius: "rounded-br-full",
  },
  yellow: {
    tone: "A4",
    key: "a",
    customPadColor: "pad-color-yellow",
    borderRadius: "rounded-bl-full",
  },
} as const;
