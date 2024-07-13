import { DeepReadonly } from "../../types";
import { PadConfig, PadId } from "./types";

export const pads: DeepReadonly<{ [key in PadId]: PadConfig }> = {
  green: {
    tone: "E4",
    key: "q",
    bgColor: "bg-green-600",
    bgActiveColor: "bg-green-500",
    borderRadius: "rounded-tl-full",
  },
  red: {
    tone: "C#4",
    key: "w",
    bgColor: "bg-red-600",
    bgActiveColor: "bg-red-500",
    borderRadius: "rounded-tr-full",
  },
  blue: {
    tone: "E5",
    key: "s",
    bgColor: "bg-blue-600",
    bgActiveColor: "bg-blue-500",
    borderRadius: "rounded-br-full",
  },
  yellow: {
    tone: "A4",
    key: "a",
    bgColor: "bg-yellow-600",
    bgActiveColor: "bg-yellow-500",
    borderRadius: "rounded-bl-full",
  },
} as const;
